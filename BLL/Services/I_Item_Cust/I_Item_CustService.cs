using Inv.DAL.Domain;
using Inv.DAL.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
namespace Inv.BLL.Services.I_Item_Cust
{
  public  class I_Item_CustService: II_Item_CustService
    {
        private readonly IUnitOfWork unitOfWork;

        public I_Item_CustService(IUnitOfWork _unitOfWork)
        {
            this.unitOfWork = _unitOfWork;
        }
        #region ItemDefService Services

        public I_Item_Customer GetById(int id)
        {
            return unitOfWork.Repository<I_Item_Customer>().GetById(id);
        }
        public I_Item_Customer GetByIdFromIItem(int id)
        {
            return unitOfWork.Repository<I_Item_Customer>().GetById(id);
        }

        public List<I_Item_Customer> GetAll()
        {
            return unitOfWork.Repository<I_Item_Customer>().GetAll();
        }

        public List<I_Item_Customer> GetAll(Expression<Func<I_Item_Customer, bool>> predicate)
        {
            return unitOfWork.Repository<I_Item_Customer>().Get(predicate);
        }

        public I_Item_Customer Insert(I_Item_Customer entity)
        {
            var Item = unitOfWork.Repository<I_Item_Customer>().Insert(entity);
            unitOfWork.Save();
            return Item;
        }

        public I_Item_Customer Update(I_Item_Customer entity)
        {

            var Item = unitOfWork.Repository<I_Item_Customer>().Update(entity);
            unitOfWork.Save();
            return Item;
        }

        public void Delete(int id)
        {
            unitOfWork.Repository<I_Item_Customer>().Delete(id);
            unitOfWork.Save();
        }

        public void InsertLst(List<I_Item_Customer> obj)
        {
            unitOfWork.Repository<I_Item_Customer>().Insert(obj);
            unitOfWork.Save();
            return;
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
