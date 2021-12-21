
$(document).ready(() => {
    //debugger;
    FullSock.InitalizeComponent();
})

namespace FullSock {
    var TypeStock: string = "2";    

    var sys: SystemTools = new SystemTools();
    var ReportGrid: JsGrid = new JsGrid();
    var SysSession: SystemSession = GetSystemSession();    
    var detailstock: Array<IQ_GetItemStore> = new Array<IQ_GetItemStore>(); 
    var SearchDetails: Array<IQ_GetItemStore> = new Array<IQ_GetItemStore>();
    var compcode: Number;
    var searchbutmemreport = document.getElementById("searchbutmemreport") as HTMLInputElement;
    var lang = (SysSession.CurrentEnvironment.ScreenLanguage);

    export function InitalizeComponent() {
        if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
            document.getElementById('Screen_name').innerHTML = "المخزون الهالك";      
        } else {
            document.getElementById('Screen_name').innerHTML = "Raw Stock";    
        }
        compcode = Number(SysSession.CurrentEnvironment.CompCode);    
        Displaystore();
        searchbutmemreport.onkeyup = searchbutmemreport_onkey;
    }
    function searchbutmemreport_onkey() {   
        if (searchbutmemreport.value != "") {
            let search: string = searchbutmemreport.value.toLowerCase();
            SearchDetails = detailstock.filter(x => x.DescA.toLowerCase().search(search) >= 0 || x.DescL.toLowerCase().search(search) >= 0 || x.CategoryDescA.toLowerCase().search(search) >= 0 || x.CategoryDescL.toLowerCase().search(search) >= 0 || x.ItemFamilyDescA.toLowerCase().search(search) >= 0 || x.ItemFamilyDescE.toLowerCase().search(search) >= 0);
            ReportGrid.DataSource = SearchDetails;
            ReportGrid.Bind();  }
        else { ReportGrid.DataSource = detailstock; ReportGrid.Bind(); }
    }
   
    function Displaystore() {
        
        $('#divMasterGridiv').removeClass('display_none');     
        detailstock = new Array<IQ_GetItemStore>();
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
                     
                    detailstock = result.Response as Array<IQ_GetItemStore>;    
                    InitializeGridstock();
                    ReportGrid.DataSource = detailstock;
                    ReportGrid.Bind();    
                }    
            }
        });
    }
    function InitializeGridstock() {        
        $("#id_ReportGrid").attr("style", "");
        ReportGrid.ElementName = "divMasterGrid";
        ReportGrid.Paging = true;
        ReportGrid.PageSize = 15;
        ReportGrid.Sorting = true;
        ReportGrid.InsertionMode = JsGridInsertionMode.Binding;
        ReportGrid.Editing = false;
        ReportGrid.Inserting = false;  
        ReportGrid.SelectedIndex = 1;
        ReportGrid.PrimaryKey = "ItemID";
        ReportGrid.OnItemEditing = () => { };
        ReportGrid.Columns = [
            { title: "ID", name: "ItemID", type: "text", width: "2%", visible: false },
            { title: 'كود الصنف', name: "ItemCode", type: "text", width: "10%" },
            { title: 'الوصف', name: (lang == "ar" ? "DescA" : "DescL"), type: "text", width: "35%" },
            { title: 'الفئة', name: (lang == "ar" ? "CategoryDescA" : "CategoryDescL"), type: "text", width: "12%" },
            { title: 'الصنف الرئيسي', name: (lang == "ar" ? "ItemFamilyDescA" : "ItemFamilyDescE"), type: "text", width: "14%" },
            { title: 'الوحدة الرئيسية', name: (lang == "ar" ? "UOMDescA" : "UOMDescE"), type: "text", width: "16%" },
            { title: 'كمية المخزون', name: "OnhandQty", type: "text", width: "13%" },
        ];      
        ReportGrid.Bind();
    }
}
 












