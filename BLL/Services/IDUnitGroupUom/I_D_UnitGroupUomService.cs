using Inv.DAL.Domain;
using Inv.DAL.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Inv.BLL.Services.IDUnitGroupUom
{
    public class I_D_UnitGroupUomService : II_D_UnitGroupUomService
    {
        private readonly IUnitOfWork unitOfWork;

        public I_D_UnitGroupUomService(IUnitOfWork _unitOfWork)
        {
            this.unitOfWork = _unitOfWork;
        }

        #region IGenDefGroupUom Services


         public I_D_UnitGroupUom GetById(int id)
        {
            return unitOfWork.Repository<I_D_UnitGroupUom>().GetById(id);
        }

        public List<I_D_UnitGroupUom> GetAll()
        {
            return unitOfWork.Repository<I_D_UnitGroupUom>().GetAll();
        }

        public List<I_D_UnitGroupUom> GetAll(Expression<Func<I_D_UnitGroupUom, bool>> predicate)
        {
            return unitOfWork.Repository<I_D_UnitGroupUom>().Get(predicate);
        }

        public I_D_UnitGroupUom Insert(I_D_UnitGroupUom entity)
        {
            var memb = unitOfWork.Repository<I_D_UnitGroupUom>().Insert(entity);
            unitOfWork.Save();
            return memb;
        }

        public I_D_UnitGroupUom Update(I_D_UnitGroupUom entity)
        {

            var memb = unitOfWork.Repository<I_D_UnitGroupUom>().Update(entity);
            unitOfWork.Save();
            return memb;
        }

        public void Delete(int id)
        {
            unitOfWork.Repository<I_D_UnitGroupUom>().Delete(id);
            unitOfWork.Save();
        }


         #endregion
    }
}
