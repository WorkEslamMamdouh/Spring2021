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
    
    public partial class I_G_ItemType
    {
        public int CompCode { get; set; }
        public int ItemTypeID { get; set; }
        public string DescA { get; set; }
        public string DescL { get; set; }
        public Nullable<bool> ISSales { get; set; }
        public Nullable<bool> IsStock { get; set; }
        public Nullable<bool> IsProduct { get; set; }
        public Nullable<bool> IsIssuetoCC { get; set; }
        public Nullable<bool> IsIssueToProd { get; set; }
        public Nullable<bool> IsPurchase { get; set; }
        public Nullable<bool> IsAvailable { get; set; }
    }
}
