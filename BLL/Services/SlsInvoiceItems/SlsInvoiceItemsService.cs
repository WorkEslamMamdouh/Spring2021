using Inv.DAL.Domain;
using Inv.DAL.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Inv.BLL.Services.SlsInvoiceItems
{
   public class SlsInvoiceItemsService: ISlsInvoiceItemsService
    {
        private readonly IUnitOfWork unitOfWork;

        public SlsInvoiceItemsService(IUnitOfWork _unitOfWork)
        {
            this.unitOfWork = _unitOfWork;
        }
        public List<I_Sls_TR_InvoiceItems> GetAll(Expression<Func<I_Sls_TR_InvoiceItems, bool>> predicate)
        {
            return unitOfWork.Repository<I_Sls_TR_InvoiceItems>().Get(predicate);
        }

        public void InsertLst(List<I_Sls_TR_InvoiceItems> obj)
        {
            unitOfWork.Repository<I_Sls_TR_InvoiceItems>().Insert(obj);
            unitOfWork.Save();
            return;
        }

        public I_Sls_TR_InvoiceItems Insert(I_Sls_TR_InvoiceItems entity)
        {
            var AccDefAccount = unitOfWork.Repository<I_Sls_TR_InvoiceItems>().Insert(entity);
            unitOfWork.Save();
            return AccDefAccount;
        }

        public I_Sls_TR_InvoiceItems Update(I_Sls_TR_InvoiceItems entity)
        {

            var AccDefAccount = unitOfWork.Repository<I_Sls_TR_InvoiceItems>().Update(entity);
            unitOfWork.Save();
            return AccDefAccount;
        }

        public void Delete(int id)
        {
            unitOfWork.Repository<I_Sls_TR_InvoiceItems>().Delete(id);
            unitOfWork.Save();
        }
    }
}
