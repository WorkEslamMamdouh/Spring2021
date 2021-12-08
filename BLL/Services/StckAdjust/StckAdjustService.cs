using Inv.DAL.Domain;
using Inv.DAL.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Inv.BLL.Services.StckAdjust
{
    public class StckAdjustService : IStckAdjustService
    {
        private readonly IUnitOfWork unitOfWork;

        public StckAdjustService(IUnitOfWork _unitOfWork)
        {
            this.unitOfWork = _unitOfWork;
        }

        #region Header Services
        public I_Stk_TR_Adjust GetById(int id)
        {
            return unitOfWork.Repository<I_Stk_TR_Adjust>().GetById(id);
        }

        public List<I_Stk_TR_Adjust> GetAll(Expression<Func<I_Stk_TR_Adjust, bool>> predicate)
        {
            return unitOfWork.Repository<I_Stk_TR_Adjust>().Get(predicate);
        }

        public I_Stk_TR_Adjust Insert(I_Stk_TR_Adjust entity)
        {
            var Item = unitOfWork.Repository<I_Stk_TR_Adjust>().Insert(entity);
            unitOfWork.Save();
            return Item;
        }
        public I_Stk_TR_Adjust Update(I_Stk_TR_Adjust entity)
        {

            var Item = unitOfWork.Repository<I_Stk_TR_Adjust>().Update(entity);
            unitOfWork.Save();
            return Item;
        }
        public void UpdateList(List<I_Stk_TR_Adjust> entityList)
        {
            unitOfWork.Repository<I_Stk_TR_Adjust>().Update(entityList);
            unitOfWork.Save();

        }
        #endregion

        #region Detail Services
        public List<I_Stk_Tr_AdjustDetails> GetAll(Expression<Func<I_Stk_Tr_AdjustDetails, bool>> predicate)
        {
            return unitOfWork.Repository<I_Stk_Tr_AdjustDetails>().Get(predicate);
        }

        public void InsertLst(List<I_Stk_Tr_AdjustDetails> obj)
        {
            unitOfWork.Repository<I_Stk_Tr_AdjustDetails>().Insert(obj);
            unitOfWork.Save();
            return;
        }

        public I_Stk_Tr_AdjustDetails Insert(I_Stk_Tr_AdjustDetails entity)
        {
            var AccDefAccount = unitOfWork.Repository<I_Stk_Tr_AdjustDetails>().Insert(entity);
            unitOfWork.Save();
            return AccDefAccount;
        }

        public I_Stk_Tr_AdjustDetails Update(I_Stk_Tr_AdjustDetails entity)
        {

            var AccDefAccount = unitOfWork.Repository<I_Stk_Tr_AdjustDetails>().Update(entity);
            unitOfWork.Save();
            return AccDefAccount;
        }

        public void Delete(int id)
        {
            unitOfWork.Repository<I_Stk_Tr_AdjustDetails>().Delete(id);
            unitOfWork.Save();
        }

        #endregion

    }
}
