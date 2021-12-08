using Inv.DAL.Domain;
using Inv.DAL.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Inv.BLL.Services.StkDefItemType
{
   public class StkDefItemTypeService: IStkDefItemTypeService
    {
        private readonly IUnitOfWork unitOfWork;

        public StkDefItemTypeService(IUnitOfWork _unitOfWork)
        {
            this.unitOfWork = _unitOfWork;
        }

        #region StkDefItemTypeService

        public I_ItemFamily GetById(int id)
        {
            return unitOfWork.Repository<I_ItemFamily>().GetById(id);
        }

        public List<I_ItemFamily> GetAll()
        {
            return unitOfWork.Repository<I_ItemFamily>().GetAll();
        }

        public List<I_ItemFamily> GetAll(Expression<Func<I_ItemFamily, bool>> predicate)
        {
            return unitOfWork.Repository<I_ItemFamily>().Get(predicate);
        }

        public I_ItemFamily Insert(I_ItemFamily entity)
        {
            var memb = unitOfWork.Repository<I_ItemFamily>().Insert(entity);
            unitOfWork.Save();
            return memb;
        }

        public I_ItemFamily Update(I_ItemFamily entity)
        {

            var memb = unitOfWork.Repository<I_ItemFamily>().Update(entity);
            unitOfWork.Save();
            return memb;
        }

        public void Delete(int id)
        {
            unitOfWork.Repository<I_ItemFamily>().Delete(id);
            unitOfWork.Save();
        }

        //public void UpdateList(List<I_ItemFamily> Lstservice)
        //{

        //    var insertedRecord = Lstservice.Where(x => x.StatusFlag == "i");
        //    var updatedRecord = Lstservice.Where(x => x.StatusFlag == "u");
        //    var deletedRecord = Lstservice.Where(x => x.StatusFlag == "d");

        //    if (updatedRecord.Count() > 0)
        //        unitOfWork.Repository<I_ItemFamily>().Update(updatedRecord);

        //    if (insertedRecord.Count() > 0)
        //        unitOfWork.Repository<I_ItemFamily>().Insert(insertedRecord);


        //    if (deletedRecord.Count() > 0)
        //    {
        //        foreach (var entity in deletedRecord)
        //            unitOfWork.Repository<I_ItemFamily>().Delete(entity.ItemFamilyID);
        //    }

        //    unitOfWork.Save();

        //}
        #endregion

    }
}
