using Inv.DAL.Domain;
using Inv.DAL.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Inv.BLL.Services.II_ItemYearUomDef
{
   public class I_ItemYearUomDefService : I_ItemYearUomService
    {
        private readonly IUnitOfWork unitOfWork;

        public I_ItemYearUomDefService(IUnitOfWork _unitOfWork)
        {
            this.unitOfWork = _unitOfWork;
        }

        #region ItemDefService Services

        public I_ItemYearUom GetById(int id)
        {
            return unitOfWork.Repository<I_ItemYearUom>().GetById(id);
        }
        public I_ItemYearUom GetByIdFromIItem(int id)
        {
            return unitOfWork.Repository<I_ItemYearUom>().GetById(id);
        }

        public List<I_ItemYearUom> GetAll()
        {
            return unitOfWork.Repository<I_ItemYearUom>().GetAll();
        }

        public List<I_ItemYearUom> GetAll(Expression<Func<I_ItemYearUom, bool>> predicate)
        {
            return unitOfWork.Repository<I_ItemYearUom>().Get(predicate);
        }

        public I_ItemYearUom Insert(I_ItemYearUom entity)
        {
            var Item = unitOfWork.Repository<I_ItemYearUom>().Insert(entity);
            unitOfWork.Save();
            return Item;
        }

        public I_ItemYearUom Update(I_ItemYearUom entity)
        {

            var Item = unitOfWork.Repository<I_ItemYearUom>().Update(entity);
            unitOfWork.Save();
            return Item;
        }

        public void Delete(int id)
        {
            unitOfWork.Repository<I_ItemYearUom>().Delete(id);
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
