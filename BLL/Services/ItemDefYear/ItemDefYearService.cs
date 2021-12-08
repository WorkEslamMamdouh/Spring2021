using Inv.DAL.Domain;
using Inv.DAL.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Inv.BLL.Services.ItemDefYear
{
   public class ItemDefYearService : IItemDefYearService
    {
        private readonly IUnitOfWork unitOfWork;

        public ItemDefYearService(IUnitOfWork _unitOfWork)
        {
            this.unitOfWork = _unitOfWork;
        }

        #region ItemDefService Services

        public I_ItemYear GetById(int id)
        {
            return unitOfWork.Repository<I_ItemYear>().GetById(id);
        }
        public I_ItemYear GetByIdFromIItem(int id)
        {
            return unitOfWork.Repository<I_ItemYear>().GetById(id);
        }

        public List<I_ItemYear> GetAll()
        {
            return unitOfWork.Repository<I_ItemYear>().GetAll();
        }

        public List<I_ItemYear> GetAll(Expression<Func<I_ItemYear, bool>> predicate)
        {
            return unitOfWork.Repository<I_ItemYear>().Get(predicate);
        }

        public I_ItemYear Insert(I_ItemYear entity)
        {
            var Item = unitOfWork.Repository<I_ItemYear>().Insert(entity);
            unitOfWork.Save();
            return Item;
        }

        public I_ItemYear Update(I_ItemYear entity)
        {

            var Item = unitOfWork.Repository<I_ItemYear>().Update(entity);
            unitOfWork.Save();
            return Item;
        }

        public void Delete(int id)
        {
            unitOfWork.Repository<I_ItemYear>().Delete(id);
            unitOfWork.Save();
        }

        //public void UpdateList(List<I_Item> Lstservice)
        //// public void UpdateList(string s)
        //{

        //    var insertedRecord = Lstservice.Where(x => x.StatusFlag == 'i');
        //    var updatedRecord = Lstservice.Where(x => x.StatusFlag == 'u');
        //    var deletedRecord = Lstservice.Where(x => x.StatusFlag == 'd');

        //    if (updatedRecord.Count() > 0)
        //        unitOfWork.Repository<G_Nationality>().Update(updatedRecord);

        //    if (insertedRecord.Count() > 0)
        //        unitOfWork.Repository<G_Nationality>().Insert(insertedRecord);


        //    if (deletedRecord.Count() > 0)
        //    {
        //        foreach (var entity in deletedRecord)
        //            unitOfWork.Repository<G_Nationality>().Delete(entity.NationalityID);
        //    }

        //    unitOfWork.Save();

        //}
        #endregion
    }
}
