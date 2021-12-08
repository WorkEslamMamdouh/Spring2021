using Inv.DAL.Domain;
using Inv.DAL.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Inv.BLL.Services.IDUnitGroup
{
   public class I_D_UnitGroupService : II_D_UnitGroupService
    {
        private readonly IUnitOfWork unitOfWork;

        public I_D_UnitGroupService(IUnitOfWork _unitOfWork)
        {
            this.unitOfWork = _unitOfWork;
        }

        #region I_D_UnitGroup Services
        public I_D_UnitGroup GetById(int id)
        {
            return unitOfWork.Repository<I_D_UnitGroup>().GetById(id);
        }

        public List<I_D_UnitGroup> GetAll()
        {
            return unitOfWork.Repository<I_D_UnitGroup>().GetAll();
        }

        public List<I_D_UnitGroup> GetAll(Expression<Func<I_D_UnitGroup, bool>> predicate)
        {
            return unitOfWork.Repository<I_D_UnitGroup>().Get(predicate);
        }

        public I_D_UnitGroup Insert(I_D_UnitGroup entity)
        {
            var memb = unitOfWork.Repository<I_D_UnitGroup>().Insert(entity);
            unitOfWork.Save();
            return memb;
        }

        public I_D_UnitGroup Update(I_D_UnitGroup entity)
        {

            var memb = unitOfWork.Repository<I_D_UnitGroup>().Update(entity);
            unitOfWork.Save();
            return memb;
        }

        public void Delete(int id)
        {
            unitOfWork.Repository<I_D_UnitGroup>().Delete(id);
            unitOfWork.Save();
        }

        
        #endregion
    }
}
