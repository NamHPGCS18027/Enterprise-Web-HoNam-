using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Newtonsoft.Json;
using WebEnterprise_mssql.Api.Configuration;
using WebEnterprise_mssql.Api.Data;
using WebEnterprise_mssql.Api.Models;
using WebEnterprise_mssql.Api.Repository;
using WebEnterprise_mssql.Api.Services;

namespace WebEnterprise_mssql.Api
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.Configure<JwtConfig>(Configuration.GetSection("JwtConfig"));

            services.AddOptions();                                         
            var mailsettings = Configuration.GetSection("MailSettings");
            services.Configure<MailSettings>(mailsettings);

            // services.AddDbContext<ApiDbContext>(options =>
            //     options.UseSqlite(
            //         Configuration.GetConnectionString("SQLiteConnection")
            //     )
            // );

            // services.AddDbContext<ApiDbContext>(options => 
            //     options.UseSqlServer(
            //         Configuration.GetConnectionString("DefaultConnection")
            //     )
            // );

            //services.AddDbContext<ApiDbContext>(options =>
            //    options.UseSqlServer(
            //        Configuration.GetConnectionString("LocalConnection")
            //    )
            //);

            services.AddDbContext<ApiDbContext>(options =>
                options.UseSqlServer(
                    Configuration.GetConnectionString("SmarterASPNETConnection")
                )
            );

            services.AddTransient<IPostsRepository, PostsRepository>();
            services.AddTransient<IFilesPathRepository, FilesPathRepository>();
            services.AddScoped<IRepositoryWrapper, RepositoryWrapper>();

            //service DI config
            services.AddTransient<ISendMailService, SendMailService>();

            // var secret = "GRdn5Am12XF9EPfU2d06xazg1LXQ3GdS";
            var secret = Configuration["JwtConfig:Secret"];
            var key = Encoding.ASCII.GetBytes(secret);

            var TokenValidationParams = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateIssuer = false,
                ValidateAudience = false,
                ValidateLifetime = true,
                RequireExpirationTime = false,

                ClockSkew = TimeSpan.Zero
            };

            services.AddSingleton(TokenValidationParams);

            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;

            })
            .AddJwtBearer(jwt =>
            {
                jwt.SaveToken = true;
                jwt.TokenValidationParameters = TokenValidationParams;
            });

            services.AddIdentity<ApplicationUser, IdentityRole>(options =>
            {
                options.SignIn.RequireConfirmedAccount = true;
                options.SignIn.RequireConfirmedEmail = true;
            })
            .AddEntityFrameworkStores<ApiDbContext>()
            .AddDefaultTokenProviders();

            services.Configure<EmailConfirmationTokenProviderOptions>(opt =>
                opt.TokenLifespan = TimeSpan.FromDays(3));

            //Enable CORS
            services.AddCors();

            //============================================================
            //Add the policy to the claims
            // services.AddAuthorization(options => {
            //     options.AddPolicy("[Policy Name]", 
            //     policy => policy.RequireClaim("[Claim Name]"));
            // });
            //============================================================


            //Add Automapper to mapping the domains models to Dtos 
            services.AddAutoMapper(typeof(Startup));

            services.AddControllers(options =>
            {
                options.SuppressAsyncSuffixInActionNames = false;
            }).AddNewtonsoftJson(options => options.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore);
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "WebEnterprise_mssql", Version = "v1" });
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "WebEnterprise_mssql v1"));
            }

            app.UseHttpsRedirection();

            //Enable CORS
            app.UseCors(options =>
            {
                options
                    .AllowAnyOrigin()
                    .AllowAnyMethod()
                    .AllowAnyHeader();
            });

            app.UseRouting();

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
