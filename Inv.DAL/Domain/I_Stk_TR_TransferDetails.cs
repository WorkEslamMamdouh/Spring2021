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
    
    public partial class I_Stk_TR_TransferDetails
    {
        public int TransfareDetailID { get; set; }
        public Nullable<int> TransfareID { get; set; }
        public Nullable<int> Serial { get; set; }
        public string BarCode { get; set; }
        public Nullable<int> ItemID { get; set; }
        public Nullable<int> SourceItemStoreBatchid { get; set; }
        public Nullable<int> DestItemStoreBatchid { get; set; }
        public Nullable<decimal> UnitCost { get; set; }
        public Nullable<int> UnitID { get; set; }
        public Nullable<decimal> ReqQty { get; set; }
        public Nullable<decimal> SendQty { get; set; }
        public Nullable<decimal> RecQty { get; set; }
        public Nullable<decimal> StockReqQty { get; set; }
        public Nullable<decimal> StockSendQty { get; set; }
        public Nullable<decimal> StockRecQty { get; set; }
        public Nullable<decimal> SrcOhnandQty { get; set; }
        public Nullable<decimal> RecOnhandQty { get; set; }
    }
}
