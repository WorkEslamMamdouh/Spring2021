
$(document).ready(() => {
    //debugger;
    FullSock.InitalizeComponent();
})

namespace FullSock {
    var TypeStock: string = "2";
    var TypeTrans: string = "1";

    var sys: SystemTools = new SystemTools();
    var ReportGrid: JsGrid = new JsGrid();
    var SysSession: SystemSession = GetSystemSession();


    var detailstock: Array<IQ_GetItemStore> = new Array<IQ_GetItemStore>();
    var Selected_Data: Array<IQ_GetItemStore> = new Array<IQ_GetItemStore>();
    var ItemID: number = 0;
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

                    //for (var i = 0; i < detailstock.length; i++) {

                    //    detailstock[i].NameIsActive = detailstock[i].IsActive == true ? (lang == "ar" ? "فعال" : "Active") : (lang == "ar" ? "غير فعال" : "Not Active");
                    //}
                    InitializeGridstock();
                    ReportGrid.DataSource = detailstock;
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
    function MasterGridDoubleClick() {



        Selected_Data = detailstock.filter(x => x.ItemID == Number(ReportGrid.SelectedKey));

        ItemID = Selected_Data[0].ItemID;
        $("#div_Master_Hedr").removeClass("display_none");

        DisplayData(Selected_Data);
        $('#Div_Show_units').removeClass('display_none');
        $('#Div_Show_Quantity').removeClass('display_none');
        if (SysSession.CurrentPrivileges.CUSTOM2 == false) {
            $('#costdiv').addClass('display_none');
        } else {
            $('#costdiv').removeClass('display_none');
        }

        $('#txtFamily').html('');
        //Display_ItemFamilynew1 = Display_ItemFamily.filter(x => x.CatID == Number(txtCat_Type.value))
        //for (var i = 0; i < Display_ItemFamilynew1.length; i++) {
        //    $('#txtFamily').append('<option value="' + Display_ItemFamilynew1[i].ItemFamilyID + '">' + (lang == "ar" ? Display_ItemFamilynew1[i].DescA : Display_ItemFamilynew1[i].DescL) + '</option>');

        //}

    }
    function DisplayData(Selected_Data: Array<IQ_GetItemStore>) {


        DocumentActions.RenderFromModel(Selected_Data[0]);
        $('#Div_Show_units').addClass('display_none');
        $('#Div_Show_Quantity').addClass('display_none');



    }


    function drpType_onchange() {
        debugger
        if (drpType.value == "0") {
            $('#Stock').removeClass('display_none');
            $('#Trans').addClass('display_none');
            Displaystore();
        } else if (drpType.value == "1") {
            $('#Trans').removeClass('display_none');
            $('#Stock').addClass('display_none');
        }
        else {
            $('#Trans').addClass('display_none');
            $('#Stock').addClass('display_none');
        }
    }
}












