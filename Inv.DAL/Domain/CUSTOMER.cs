//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace Inv.DAL.Domain
{
    using System;
    using System.Collections.Generic;
    
    public partial class CUSTOMER
    {
        public int CUSTOMER_ID { get; set; }
        public string CustomerCODE { get; set; }
        public string CUSTOMER_NAME { get; set; }
        public string NAMEE { get; set; }
        public string CUSTOMER_ADDRES { get; set; }
        public string CUSTOMER_ADDRES_2 { get; set; }
        public string PHONE { get; set; }
        public string EMAIL { get; set; }
        public string REMARKS { get; set; }
        public Nullable<bool> STATUS { get; set; }
        public Nullable<int> BranchCode { get; set; }
        public Nullable<int> CompCode { get; set; }
        public string CREATED_BY { get; set; }
        public Nullable<System.DateTime> CREATED_AT { get; set; }
        public Nullable<System.DateTime> UPDATED_AT { get; set; }
        public string UPDATED_BY { get; set; }
        public string VatNo { get; set; }
        public Nullable<decimal> CreditLimit { get; set; }
        public Nullable<decimal> CreditLimitFC { get; set; }
        public Nullable<int> CreditPeriod { get; set; }
        public Nullable<decimal> OpenBalanceFC { get; set; }
        public Nullable<decimal> Openbalance { get; set; }
        public Nullable<decimal> Debit { get; set; }
        public Nullable<decimal> DebitFC { get; set; }
        public Nullable<decimal> Credit { get; set; }
        public Nullable<decimal> CreditFC { get; set; }
        public Nullable<bool> IsCreditCustomer { get; set; }
    }
}
