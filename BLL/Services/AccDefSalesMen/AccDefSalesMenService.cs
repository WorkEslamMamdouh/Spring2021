using Inv.DAL.Domain;
using Inv.DAL.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Inv.BLL.Services.AccDefSalesMen
{//I_Sls_D_Salesman
    public class AccDefSalesMenService: IAccDefSalesMenService
    {
        private readonly IUnitOfWork unitOfWork;

        public AccDefSalesMenService(IUnitOfWork _unitOfWork)
        {
            this.unitOfWork = _unitOfWork;
        }

        #region AccDefSalesMenService Services
        public I_Sls_D_Salesman GetById(int id)
        {
            return unitOfWork.Repository<I_Sls_D_Salesman>().GetById(id);
        }

        public List<I_Sls_D_Salesman> GetAll()
        {
            return unitOfWork.Repository<I_Sls_D_Salesman>().GetAll();
        }

        public List<I_Sls_D_Salesman> GetAll(Expression<Func<I_Sls_D_Salesman, bool>> predicate)
        {
            return unitOfWork.Repository<I_Sls_D_Salesman>().Get(predicate);
        } 
        public List<IQ_GetSalesMan> GetSalesManView(Expression<Func<IQ_GetSalesMan, bool>> predicate)
        {
            return unitOfWork.Repository<IQ_GetSalesMan>().Get(predicate);
        }

        public I_Sls_D_Salesman Insert(I_Sls_D_Salesman entity)
        {
            var salesman = unitOfWork.Repository<I_Sls_D_Salesman>().Insert(entity);
            unitOfWork.Save();
            return salesman;
        }

        public I_Sls_D_Salesman Update(I_Sls_D_Salesman entity)
        {

            var salesman = unitOfWork.Repository<I_Sls_D_Salesman>().Update(entity);
            unitOfWork.Save();
            return salesman;
        }

        public void Delete(int id)
        {
            unitOfWork.Repository<I_Sls_D_Salesman>().Delete(id);
            unitOfWork.Save();
        }

        public void UpdateList(List<I_Sls_D_Salesman> AccDefAccountList)
        {

            foreach (var entity in AccDefAccountList)
            {
                if (entity.StatusFlag == 'd')
                    unitOfWork.Repository<I_Sls_D_Salesman>().Delete(entity.SalesmanId);
                if (entity.StatusFlag == 'u')
                {
                    entity.UPDATED_AT = DateTime.Now;
                    unitOfWork.Repository<I_Sls_D_Salesman>().Update(entity);
                }
                if (entity.StatusFlag == 'i')
                {
                    entity.CREATED_AT = DateTime.Now;
                    unitOfWork.Repository<I_Sls_D_Salesman>().Insert(entity);
                }
            }
            unitOfWork.Save();

        }
        #endregion

    }
}
