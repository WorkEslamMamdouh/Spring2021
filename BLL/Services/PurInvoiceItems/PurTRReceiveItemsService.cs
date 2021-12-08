using Inv.DAL.Domain;
using Inv.DAL.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Inv.BLL.Services.PurInvoiceItems
{
    public class PurTRReceiveItemsService : IPurTRReceiveItemsService
    {
        private readonly IUnitOfWork unitOfWork;

        public PurTRReceiveItemsService(IUnitOfWork _unitOfWork)
        {
            this.unitOfWork = _unitOfWork;
        }
        public void InsertLst(List<I_Pur_TR_ReceiveItems> obj)
        {
            unitOfWork.Repository<I_Pur_TR_ReceiveItems>().Insert(obj);
            unitOfWork.Save();
            return;
        }

        public I_Pur_TR_ReceiveItems Insert(I_Pur_TR_ReceiveItems entity)
        {
            var AccDefAccount = unitOfWork.Repository<I_Pur_TR_ReceiveItems>().Insert(entity);
            unitOfWork.Save();
            return AccDefAccount;
        }

        public I_Pur_TR_ReceiveItems Update(I_Pur_TR_ReceiveItems entity)
        {

            var AccDefAccount = unitOfWork.Repository<I_Pur_TR_ReceiveItems>().Update(entity);
            unitOfWork.Save();
            return AccDefAccount;
        }

        public void Delete(int id)
        {
            unitOfWork.Repository<I_Pur_TR_ReceiveItems>().Delete(id);
            unitOfWork.Save();
        }
    }
}
