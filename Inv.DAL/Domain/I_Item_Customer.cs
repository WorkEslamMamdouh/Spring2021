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
    
    public partial class I_Item_Customer
    {
        public int Id { get; set; }
        public Nullable<int> CUSTOMER_ID { get; set; }
        public Nullable<int> ItemID { get; set; }
        public Nullable<int> Serial { get; set; }
        public string ItemCode { get; set; }
        public string DescA { get; set; }
        public string DescL { get; set; }
        public Nullable<decimal> Unitprice { get; set; }
        public Nullable<int> UomID { get; set; }
        public Nullable<bool> STATUS { get; set; }
    }
}
