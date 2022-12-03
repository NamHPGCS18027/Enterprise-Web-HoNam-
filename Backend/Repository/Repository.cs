using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using WebEnterprise_mssql.Api.Data;

namespace WebEnterprise_mssql.Api.Repository
{
    public class Repository<T> : IRepository<T> where T : class
    {
        private readonly ApiDbContext context;

        public Repository(ApiDbContext context)
        {
            this.context = context;
        }

        public IQueryable<T> FindAll() => context.Set<T>().AsNoTracking();
        public IQueryable<T> FindByCondition(Expression<Func<T, bool>> expression) => 
            context.Set<T>().Where(expression).AsNoTracking();
        public void Create(T entity) => context.Set<T>().Add(entity);
        
        public void Update(T entity) => context.Set<T>().Update(entity);
        public void Delete(T entity) => context.Set<T>().Remove(entity);
        public EntityEntry<T> GetEntityEntry(T entity) => context.Entry<T>(entity);
        public void AttachEntity(T entity) => context.Attach<T>(entity);

        public void DeleteRange(IEnumerable<T> entities)
        {
            context.Set<T>().RemoveRange(entities);
        }
    }
}