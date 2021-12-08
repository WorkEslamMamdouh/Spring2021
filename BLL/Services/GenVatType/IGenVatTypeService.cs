using Inv.DAL.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Inv.BLL.Services.GenVatType
{
    public interface IGenVatTypeService
    {
        A_D_VAT_TYPE GetById(int id);
        List<A_D_VAT_TYPE> GetAll();
        List<A_D_VAT_TYPE> GetAll(Expression<Func<A_D_VAT_TYPE, bool>> predicate);
    }

}
