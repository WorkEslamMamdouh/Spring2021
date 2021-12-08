using Inv.DAL.Domain;
using Inv.DAL.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
namespace Inv.BLL.Services.PurTrReceive
{
  public  class PurTrReceiveService: IPurTrReceiveService
    {
        private readonly IUnitOfWork unitOfWork;

        public PurTrReceiveService(IUnitOfWork _unitOfWork)
        {
            this.unitOfWork = _unitOfWork;
        }
        #region ItemDefService Services

        public I_Pur_TR_Receive GetById(int id)
        {
            return unitOfWork.Repository<I_Pur_TR_Receive>().GetById(id);
        }
        public I_Pur_TR_Receive GetByIdFromIItem(int id)
        {
            return unitOfWork.Repository<I_Pur_TR_Receive>().GetById(id);
        }

        public List<I_Pur_TR_Receive> GetAll()
        {
            return unitOfWork.Repository<I_Pur_TR_Receive>().GetAll();
        }

        public List<I_Pur_TR_Receive> GetAll(Expression<Func<I_Pur_TR_Receive, bool>> predicate)
        {
            return unitOfWork.Repository<I_Pur_TR_Receive>().Get(predicate);
        }

        public I_Pur_TR_Receive Insert(I_Pur_TR_Receive entity)
        {
            var Item = unitOfWork.Repository<I_Pur_TR_Receive>().Insert(entity);
            unitOfWork.Save();
            return Item;
        }

        public I_Pur_TR_Receive Update(I_Pur_TR_Receive entity)
        {

            var Item = unitOfWork.Repository<I_Pur_TR_Receive>().Update(entity);
            unitOfWork.Save();
            return Item;
        }

        public void Delete(int id)
        {
            unitOfWork.Repository<I_Pur_TR_Receive>().Delete(id);
            unitOfWork.Save();
        }

        public void InsertLst(List<I_Pur_TR_Receive> obj)
        {
            unitOfWork.Repository<I_Pur_TR_Receive>().Insert(obj);
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
