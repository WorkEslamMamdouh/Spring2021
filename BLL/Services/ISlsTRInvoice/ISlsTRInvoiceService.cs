using Inv.DAL.Domain;
using Inv.DAL.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Inv.BLL.Services.ISlsTRInvoice
{
 public  class ISlsTRInvoiceService: IISlsTRInvoiceService
    {
        private readonly IUnitOfWork unitOfWork;

        public ISlsTRInvoiceService(IUnitOfWork _unitOfWork)
        {
            this.unitOfWork = _unitOfWork;
        }
        public I_Sls_TR_Invoice GetById(int id)
        {
            return unitOfWork.Repository<I_Sls_TR_Invoice>().GetById(id);
        }


        public I_Sls_TR_Invoice Insert(I_Sls_TR_Invoice entity)
        {
            var Item = unitOfWork.Repository<I_Sls_TR_Invoice>().Insert(entity);
            unitOfWork.Save();
            return Item;
        }
        public I_Sls_TR_Invoice Update(I_Sls_TR_Invoice entity)
        {

            var Item = unitOfWork.Repository<I_Sls_TR_Invoice>().Update(entity);
            unitOfWork.Save();
            return Item;
        }
        public void UpdateList(List<I_Sls_TR_Invoice> entityList)
        {
            unitOfWork.Repository<I_Sls_TR_Invoice>().Update(entityList);
            unitOfWork.Save();

        }


        //#region ItemDefService Services

        //public IQ_GetItemStoreInfo GetById(int id)
        //{
        //    return unitOfWork.Repository<IQ_GetItemStoreInfo>().GetById(id);
        //}

        //public List<IQ_GetItemStoreInfo> GetAll()
        //{
        //    return unitOfWork.Repository<IQ_GetItemStoreInfo>().GetAll();
        //}

        //public List<IQ_GetItemStoreInfo> GetAll(Expression<Func<IQ_GetItemStoreInfo, bool>> predicate)
        //{
        //    return unitOfWork.Repository<IQ_GetItemStoreInfo>().Get(predicate);
        //}


        //public I_Item Update(I_Item entity)
        //{

        //    var Item = unitOfWork.Repository<I_Item>().Update(entity);
        //    unitOfWork.Save();
        //    return Item;
        //}

        //public void Delete(int id)
        //{
        //    unitOfWork.Repository<I_Item>().Delete(id);
        //    unitOfWork.Save();
        //}

        ////public void UpdateList(List<I_Item> Lstservice)
        ////// public void UpdateList(string s)
        ////{

        ////    var insertedRecord = Lstservice.Where(x => x.StatusFlag == 'i');
        ////    var updatedRecord = Lstservice.Where(x => x.StatusFlag == 'u');
        ////    var deletedRecord = Lstservice.Where(x => x.StatusFlag == 'd');

        ////    if (updatedRecord.Count() > 0)
        ////        unitOfWork.Repository<G_Nationality>().Update(updatedRecord);

        ////    if (insertedRecord.Count() > 0)
        ////        unitOfWork.Repository<G_Nationality>().Insert(insertedRecord);


        ////    if (deletedRecord.Count() > 0)
        ////    {
        ////        foreach (var entity in deletedRecord)
        ////            unitOfWork.Repository<G_Nationality>().Delete(entity.NationalityID);
        ////    }

        ////    unitOfWork.Save();

        ////}
        //#endregion
    }
}
