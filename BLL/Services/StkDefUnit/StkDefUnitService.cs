using Inv.DAL.Domain;
using Inv.DAL.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Inv.BLL.Services.StkDefUnit
{
   public class StkDefUnitService:IStkDefUnitService
    {
        private readonly IUnitOfWork unitOfWork;

        public StkDefUnitService(IUnitOfWork _unitOfWork)
        {
            this.unitOfWork = _unitOfWork;
        }
        #region StkDefUnitService Service

        public I_D_UOM GetById(int id)
        {
            return unitOfWork.Repository<I_D_UOM>().GetById(id);
        }

        public List<I_D_UOM> GetAll()
        {
            return unitOfWork.Repository<I_D_UOM>().GetAll();
        }

        public List<I_D_UOM> GetAll(Expression<Func<I_D_UOM, bool>> predicate)
        {
            return unitOfWork.Repository<I_D_UOM>().Get(predicate);
        }
        #endregion
    }
}
