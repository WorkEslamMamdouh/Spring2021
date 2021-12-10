﻿
$(document).ready(() => {
    //debugger;
    RawStock.InitalizeComponent();
})

namespace RawStock {
    var TypeStock: string = "0";
    var TypeTrans: string = "1";
   
    var sys: SystemTools = new SystemTools();
    var ReportGrid: JsGrid = new JsGrid();
    var SysSession: SystemSession = GetSystemSession();



    var detailstore: Array<I_ItemStore> = new Array<I_ItemStore>();

    var compcode: Number; 
    var drpType: HTMLSelectElement;

    var lang = (SysSession.CurrentEnvironment.ScreenLanguage);

    

    export function InitalizeComponent() {
        if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
            document.getElementById('Screen_name').innerHTML = "المخزون الخام";

        } else {
            document.getElementById('Screen_name').innerHTML = "Raw Stock";

        } 
        compcode = Number(SysSession.CurrentEnvironment.CompCode);
        InitalizeControls();
        InitalizeEvents();
   

    }

    
    function InitalizeControls() {
 
        drpType = document.getElementById("drpType") as HTMLSelectElement;

        // Buton privialges for single record page



    }

    function InitalizeEvents() {
        
        drpType.onchange = drpType_onchange;
    }

    function Displaystore() {


        $('#divMasterGridiv').removeClass('display_none');

        detailstore = new Array<I_ItemStore>();
        let BranchCode = Number($('#drpuserType').val());


        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("StkDefStore", "GetItemstore"),
            data: {
                CompCode: compcode, TypeStock: TypeStock, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: (d) => {

                let result = d as BaseResponse;
                if (result.IsSuccess) {

                    detailstore = result.Response as Array<I_ItemStore>;

                    //for (var i = 0; i < detailstore.length; i++) {

                    //    detailstore[i].NameIsActive = detailstore[i].IsActive == true ? (lang == "ar" ? "فعال" : "Active") : (lang == "ar" ? "غير فعال" : "Not Active");
                    //}
                    InitializeGridstock();
                    ReportGrid.DataSource = detailstore;
                    ReportGrid.Bind();


                }

            }
        });
    }
    function InitializeGridstock() {

        let res: any = GetResourceList("");
        $("#id_ReportGrid").attr("style", "");
        ReportGrid.ElementName = "divMasterGrid";
        ReportGrid.Paging = true;
        ReportGrid.PageSize = 15;
        ReportGrid.Sorting = true;
        ReportGrid.InsertionMode = JsGridInsertionMode.Binding;
        ReportGrid.Editing = false;
        ReportGrid.Inserting = false;
        ReportGrid.OnRowDoubleClicked = MasterGridDoubleClick;
        ReportGrid.SelectedIndex = 1;
        ReportGrid.PrimaryKey = "StoreId";
        ReportGrid.OnItemEditing = () => { };
        ReportGrid.Columns = [
            { title: "ID", name: "ItemID", type: "text", width: "2%", visible: false },
            { title: 'رقم الصنف', name: "ItemCode", type: "text", width: "10%" },
            { title: 'الوصف', name: (lang == "ar" ? "DescA" : "DescL"), type: "text", width: "35%" },
            { title: 'الفئة', name: (lang == "ar" ? "cat_DescA" : "Cat_DescE"), type: "text", width: "12%" },
            { title: 'الصنف الرئيسي', name: (lang == "ar" ? "fm_DescA" : "fm_DescE"), type: "text", width: "14%" },
            { title: 'الوحدة الرئيسية', name: (lang == "ar" ? "uom_DescA" : "Uom_DescE"), type: "text", width: "16%" },
            { title: 'الكمية  في الفرع ', name: "BranchQty", type: "text", width: "13%" },
            { title: 'الكمية في الشركة ', name: "CompQty", type: "text", width: "13%" },
        ];

        ReportGrid.Bind();
    }
    function MasterGridDoubleClick() {


        //$('#btnedite').removeClass('display_none');
        //$('#btnback').addClass('display_none');
        //$('#btnsave').addClass('display_none');
        //Selected_Data = new Array<GQ_GetStore>();
        //Selected_Data = detailstore.filter(x => x.StoreId == Number(ReportGrid.SelectedKey));
        //$('#StoreDetail').removeClass('display_none');

        //DisplayData(Selected_Data);




    }
    function DisplayData(Selected_Data: Array<GQ_GetStore>) {


        //DocumentActions.RenderFromModel(Selected_Data[0]);
    }

    function drpType_onchange() {
        debugger
        if (drpType.value == "0") {
            $('#Stock').removeClass('display_none');
            $('#Trans').addClass('display_none');
            Displaystore();
        } else if(drpType.value == "1"){
            $('#Trans').removeClass('display_none');
            $('#Stock').addClass('display_none');
        }
        else {
            $('#Trans').addClass('display_none');
            $('#Stock').addClass('display_none');
        }
    }
}











