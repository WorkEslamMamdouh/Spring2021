using Inv.DAL.Domain;
using Inv.DAL.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Inv.BLL.Services.GenVatType
{
   public class GenVatTypeService: IGenVatTypeService
    {
        private readonly IUnitOfWork unitOfWork;

        public GenVatTypeService(IUnitOfWork _unitOfWork)
        {
            this.unitOfWork = _unitOfWork;
        }

        #region IGenDefGroup Services

        public A_D_VAT_TYPE GetById(int id)
        {
            return unitOfWork.Repository<A_D_VAT_TYPE>().GetById(id);
        }

        public List<A_D_VAT_TYPE> GetAll()
        {
            return unitOfWork.Repository<A_D_VAT_TYPE>().GetAll();
        }

        public List<A_D_VAT_TYPE> GetAll(Expression<Func<A_D_VAT_TYPE, bool>> predicate)
        {
            return unitOfWork.Repository<A_D_VAT_TYPE>().Get(predicate);
        }
        #endregion
    }
}
