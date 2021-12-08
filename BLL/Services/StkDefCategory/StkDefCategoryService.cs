using Inv.DAL.Domain;
using Inv.DAL.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Inv.BLL.Services.StkDefCategory
{
   public class StkDefCategoryService:IStkDefCategoryService
    {
        private readonly IUnitOfWork unitOfWork;

        public StkDefCategoryService (IUnitOfWork _unitOfWork)
        {
            this.unitOfWork = _unitOfWork;
        }


        #region I_D_Category Services
        public I_D_Category GetById(int id)
        {
            return unitOfWork.Repository<I_D_Category>().GetById(id);
        }

        public List<I_D_Category> GetAll()
        {
            return unitOfWork.Repository<I_D_Category>().GetAll();
        }

        public List<I_D_Category> GetAll(Expression<Func<I_D_Category, bool>> predicate)
        {
            return unitOfWork.Repository<I_D_Category>().Get(predicate);
        }

        public I_D_Category Insert(I_D_Category entity)
        {
            var memb = unitOfWork.Repository<I_D_Category>().Insert(entity);
            unitOfWork.Save();
            return memb;
        }

        public I_D_Category Update(I_D_Category entity)
        {

            var memb = unitOfWork.Repository<I_D_Category>().Update(entity);
            unitOfWork.Save();
            return memb;
        }

        public void Delete(int id)
        {
            unitOfWork.Repository<I_D_Category>().Delete(id);
            unitOfWork.Save();
        }

        public void UpdateList(List<I_D_Category> Lstservice)
        {  
            
                foreach (var entity in Lstservice)
            {     if (entity.StatusFlag== 'd')
                    unitOfWork.Repository<I_D_Category>().Delete(entity.CatID);
                if (entity.StatusFlag == 'u')
                {
                    entity.UpdatedAt = DateTime.Now;
                    unitOfWork.Repository<I_D_Category>().Update(entity);
                }
                if (entity.StatusFlag == 'i')
                {
                    entity.CreatedAt = DateTime.Now;
                    unitOfWork.Repository<I_D_Category>().Insert(entity);
                }
        }   

            unitOfWork.Save();

        }
        #endregion
    }
}
