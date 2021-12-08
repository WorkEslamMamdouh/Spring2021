using Inv.DAL.Domain;
using Inv.DAL.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Inv.BLL.Services.VatNature
{
   public class VatNatureService : IVatNatureService
    {
        private readonly IUnitOfWork unitOfWork;

        public VatNatureService(IUnitOfWork _unitOfWork)
        {
            this.unitOfWork = _unitOfWork;
        }

        #region IGenDefGroup Services

        public G_VatNature GetById(int id)
        {
            return unitOfWork.Repository<G_VatNature>().GetById(id);
        }

        public List<G_VatNature> GetAll()
        {
            return unitOfWork.Repository<G_VatNature>().GetAll();
        }

        public List<G_VatNature> GetAll(Expression<Func<G_VatNature, bool>> predicate)
        {
            return unitOfWork.Repository<G_VatNature>().Get(predicate);
        }
        #endregion
    }
}
