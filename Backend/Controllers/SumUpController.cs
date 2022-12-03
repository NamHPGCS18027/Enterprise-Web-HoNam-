using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using OfficeOpenXml;
using System;
using System.Collections.Generic;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using WebEnterprise_mssql.Api.Repository;
using WebEnterprise_mssql.Dtos.SumUp;

namespace WebEnterprise_mssql.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SumUpController : ControllerBase
    {
        private static readonly Regex sWhitespace = new Regex(@"\s+");
        private readonly IRepositoryWrapper repo;
        private readonly ILogger<SumUpController> logger;
        private readonly IConfiguration configuration;
        private readonly IMapper mapper;

        public SumUpController(
            IRepositoryWrapper repo,
            ILogger<SumUpController> logger,
            IConfiguration configuration,
            IMapper mapper)
        {
            this.repo = repo;
            this.logger = logger;
            this.configuration = configuration;
            this.mapper = mapper;
        }

        [HttpGet]
        [Route("SumUp")]
        public async Task<IActionResult> SumUpAsync(string TopicId)
        {
            var topicName = await repo.Topics
                .FindByCondition(x => x.TopicId.Equals(Guid.Parse(TopicId)))
                .Select(x => x.TopicName)
                .FirstOrDefaultAsync();
            var listPosts = await repo.Posts
                .FindByCondition(x => x.TopicId.Equals(Guid.Parse(TopicId)))
                .ToListAsync();
            var listFilePaths = await repo.FilesPaths
                .FindAll().ToListAsync();
            List<SumUpDto> ListItem = new();
            foreach (var post in listPosts)
            {
                var item = mapper.Map<SumUpDto>(post);
                foreach(var filesPath in listFilePaths)
                {
                    if (post.PostId.Equals(filesPath.PostId))
                    {
                        item.sumUpFilePath.Add(filesPath.filePath);
                    }
                }

                var votes = await GetVote(post.PostId.ToString());
                mapper.Map(votes, item);
                ListItem.Add(item);
            }
            var newTopicName = ReplaceWhitespace(topicName, "");
            var fileName = await SaveExcelFileAsync(ListItem, $"{newTopicName}.xlsx", "sheet 1");
            var filePath = GetRootDirectory(fileName);
            var zipPath = CreateZipFile(topicName);
            foreach (var item in ListItem)
            {
                if (!item.sumUpFilePath.Count().Equals(0))
                {
                    foreach (var file in item.sumUpFilePath)
                    {
                        AddToExistingZip(zipPath, file);
                    }
                }
            }
            FileInfo fileInfo = new FileInfo(filePath);
            DeleteIfExist(fileInfo);
            return Ok(zipPath);
        }

        private void AddToExistingZip(string zipPath, string postFilePath)
        {
            using (FileStream zipToOpen = new FileStream(zipPath, FileMode.Open))
            {
                using (ZipArchive archive = new ZipArchive(zipToOpen, ZipArchiveMode.Update))
                {
                    var fileName = postFilePath.Split("~");
                    try
                    {
                        ZipArchiveEntry postFileEntry = archive.CreateEntryFromFile(postFilePath, fileName[1]);
                    }
                    catch (Exception ex)
                    {
                        logger.LogInformation($"File Paths Error: {ex}");
                    }
                }
            }
        }

        private void CheckIfValidDirectory(string path)
        {
            if (!Directory.Exists(path))
            {
                Directory.CreateDirectory(path);
            }
        }

        private string CreateZipFile(string topicName)
        {
            var rootPath = configuration["FileConfig:SumUpFilePath"];
            CheckIfValidDirectory(rootPath);
            var zipRootPath = configuration["FileConfig:ZipFilePath"];
            CheckIfValidDirectory(zipRootPath);
            //var dest = Path.Combine(rootPath, folderPath);

            var saveLocation = Path.Combine(zipRootPath, $"{topicName}.zip");
            FileInfo fileInfo = new FileInfo(saveLocation);
            DeleteIfExist(fileInfo);
            ZipFile.CreateFromDirectory(rootPath, saveLocation);
            
            //AddToExistingZip(zipPath, postFilePath);
            return saveLocation;
        }

        public static string ReplaceWhitespace(string input, string replacement)
        {
            return sWhitespace.Replace(input, replacement);
        }

        private async Task<SumUpDto> GetVote(string postId)
        {
            var upVoteCount = await repo.UpVotes
                .FindByCondition(x => x.postId.Equals(postId))
                .ToListAsync();
            var downVoteCount = await repo.DownVote
                .FindByCondition(x => x.postId.Equals(postId))
                .ToListAsync();
            return new SumUpDto { upVote = upVoteCount.Count(), downVote = downVoteCount.Count() };
        }

        private async Task<string> SaveExcelFileAsync(IEnumerable<SumUpDto> listObject, string fileName, string worksheetName)
        {
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
            var newFileInfo = GetRootDirectory(fileName);
            var file = new FileInfo(newFileInfo);
            DeleteIfExist(file);

            using var package = new ExcelPackage(file);
            var worksheet = package.Workbook.Worksheets.Add(worksheetName);
            var range = worksheet.Cells["B2"].LoadFromCollection(listObject, true);
            await package.SaveAsync();

            return file.Name;
        }

        private string GetRootDirectory(string filePath)
        {
            var rootPath = configuration["FileConfig:SumUpFilePath"];
            CheckIfValidDirectory(rootPath);

            var newFilePath = Path.Combine(rootPath, filePath);
            return newFilePath;
        }

        private void DeleteIfExist(FileInfo file)
        {
            if (file.Exists)
            {
                file.Delete();
            }
        }
    }
}