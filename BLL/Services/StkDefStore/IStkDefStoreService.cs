using Inv.DAL.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Inv.BLL.Services.StkDefStore
{
   public interface IStkDefStoreService
    {
        G_STORE GetById(int id);
        List<G_STORE> GetAll();
        List<G_STORE> GetAll(Expression<Func<G_STORE, bool>> predicate);

        G_STORE Insert(G_STORE entity);
        G_STORE Update(G_STORE entity);
    }
}
