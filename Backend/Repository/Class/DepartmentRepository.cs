using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using WebEnterprise_mssql.Api.Data;
using WebEnterprise_mssql.Api.Models;

namespace WebEnterprise_mssql.Api.Repository
{
    public class DepartmentRepository : Repository<Departments>, IDepartmentRepository
    {
        //Constructor
        public DepartmentRepository(ApiDbContext context) : base(context)
        {
        }
    }
}