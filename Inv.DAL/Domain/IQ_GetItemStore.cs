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
    
    public partial class IQ_GetItemStore
    {
        public string DescA { get; set; }
        public string DescL { get; set; }
        public int ItemStoreID { get; set; }
        public int ItemID { get; set; }
        public Nullable<int> FinYear { get; set; }
        public Nullable<int> StoreCode { get; set; }
        public Nullable<int> BraCode { get; set; }
        public Nullable<int> CompCode { get; set; }
        public string LOCATION { get; set; }
        public string LOCATION2 { get; set; }
        public Nullable<decimal> OnhandQty { get; set; }
        public Nullable<decimal> BookQty { get; set; }
        public Nullable<decimal> OnRoadQty { get; set; }
        public Nullable<decimal> OnOrderQty { get; set; }
        public Nullable<decimal> ReOrderQty { get; set; }
        public Nullable<decimal> MinQty { get; set; }
        public Nullable<decimal> MaxQty { get; set; }
        public Nullable<decimal> StartQty { get; set; }
        public Nullable<decimal> StartLocalCost { get; set; }
        public Nullable<decimal> LocalCost { get; set; }
        public Nullable<System.DateTime> CreatedAt { get; set; }
        public string CreatedBy { get; set; }
        public Nullable<System.DateTime> UpdatedAt { get; set; }
        public string UpdatedBy { get; set; }
        public Nullable<int> StoreId { get; set; }
        public Nullable<int> STORE_CODE { get; set; }
        public string St_DescA { get; set; }
        public string st_DescE { get; set; }
        public string BRA_DESC { get; set; }
        public string BRA_DESCL { get; set; }
        public int BRA_CODE { get; set; }
    }
}
