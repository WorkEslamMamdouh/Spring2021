using Inv.DAL.Domain;
using Inv.DAL.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Inv.BLL.Services.I_ItemStoreDeff
{
   public class I_ItemStoredefService : I_ItemStoreService
    {
        private readonly IUnitOfWork unitOfWork;

        public I_ItemStoredefService(IUnitOfWork _unitOfWork)
        {
            this.unitOfWork = _unitOfWork;
        }

        #region ItemDefService Services

        public I_ItemStore GetById(int id)
        {
            return unitOfWork.Repository<I_ItemStore>().GetById(id);
        }
        public I_ItemStore GetByIdFromIItem(int id)
        {
            return unitOfWork.Repository<I_ItemStore>().GetById(id);
        }

        public List<I_ItemStore> GetAll()
        {
            return unitOfWork.Repository<I_ItemStore>().GetAll();
        }

        public List<I_ItemStore> GetAll(Expression<Func<I_ItemStore, bool>> predicate)
        {
            return unitOfWork.Repository<I_ItemStore>().Get(predicate);
        }

        public I_ItemStore Insert(I_ItemStore entity)
        {
            var Item = unitOfWork.Repository<I_ItemStore>().Insert(entity);
            unitOfWork.Save();
            return Item;
        }

        public I_ItemStore Update(I_ItemStore entity)
        {

            var Item = unitOfWork.Repository<I_ItemStore>().Update(entity);
            unitOfWork.Save();
            return Item;
        }

        public void Delete(int id)
        {
            unitOfWork.Repository<I_ItemStore>().Delete(id);
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
