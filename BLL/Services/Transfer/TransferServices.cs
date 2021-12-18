using Inv.DAL.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
using Inv.DAL.Repository;

namespace Inv.BLL.Services.Transfer
{
   public class TransferServices : ITransferServices
    {
        private readonly IUnitOfWork unitOfWork;

        public TransferServices(IUnitOfWork _unitOfWork)
        {

            this.unitOfWork = _unitOfWork;

        }


        #region Nationality Services
        public I_Stk_TR_Transfer GetById(int id)
        {

            return unitOfWork.Repository<I_Stk_TR_Transfer>().GetById(id);

        }

        public List<I_Stk_TR_Transfer> GetAll()
        {
            return unitOfWork.Repository<I_Stk_TR_Transfer>().GetAll();
        }

        public List<I_Stk_TR_Transfer> GetAll(Expression<Func<I_Stk_TR_Transfer, bool>> predicate)
        {
            return unitOfWork.Repository<I_Stk_TR_Transfer>().Get(predicate);
        }

        public I_Stk_TR_Transfer Insert(I_Stk_TR_Transfer entity)
        {
            var memb = unitOfWork.Repository<I_Stk_TR_Transfer>().Insert(entity);
            unitOfWork.Save();
            return memb;
        }

        public I_Stk_TR_Transfer Update(I_Stk_TR_Transfer entity)
        {

            var memb = unitOfWork.Repository<I_Stk_TR_Transfer>().Update(entity);
            unitOfWork.Save();
            return memb;
        }

        public void Delete(int id)
        {
            unitOfWork.Repository<I_Stk_TR_Transfer>().Delete(id);
            unitOfWork.Save();
        }

        public void UpdateList(List<I_Stk_TR_TransferDetails> Lstservice)
        {

            var insertedRecord = Lstservice.Where(x => x.StatusFlag == 'i');
            var updatedRecord = Lstservice.Where(x => x.StatusFlag =='u');
            var deletedRecord = Lstservice.Where(x => x.StatusFlag == 'd');

            if (updatedRecord.Count() > 0)
                unitOfWork.Repository<I_Stk_TR_TransferDetails>().Update(updatedRecord);

            if (insertedRecord.Count() > 0)
                unitOfWork.Repository<I_Stk_TR_TransferDetails>().Insert(insertedRecord);


            if (deletedRecord.Count() > 0)
            {
                foreach (var entity in deletedRecord)
                    unitOfWork.Repository<I_Stk_TR_TransferDetails>().Delete(entity.TransfareDetailID);
            }

            unitOfWork.Save();

        }
        
        #endregion
    }
}
