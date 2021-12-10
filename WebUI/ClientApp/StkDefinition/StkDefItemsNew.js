$(document).ready(function () {
    StkDefItemsNew.InitalizeComponent();
});
var StkDefItemsNew;
(function (StkDefItemsNew) {
    var sys = new SystemTools();
    var SysSession = GetSystemSession();
    var divMasterGrid = new JsGrid();
    var divGrid1 = new JsGrid();
    var Selected_Data = new Array();
    var Detailsunitfilter = new Array();
    var SearchDetails = new Array();
    var Details = new Array();
    var DetailsQtyfilter = new Array();
    var DetailsQtyfilter = new Array();
    var Detailsunit = new Array();
    var Display_Typefilter = new Array();
    var DetailsQty = new Array();
    var ModelDetial = new Array();
    var Display_Type = new Array();
    var ModelDetialqty = new Array();
    var Display_D_UOMnew = new Array();
    var Display_STORE = new Array();
    var Display_D_UOM = new Array();
    var Modelyear = new I_ItemYearUom();
    var Modelyearqty = new I_ItemStore();
    var detailunitgrp = new Array();
    var detailunitgrpfilter = new Array();
    var Display_ItemFamily = new Array();
    var Display_ItemFamilynew = new Array();
    var Display_ItemFamilynew1 = new Array();
    var Model = new I_Item();
    var btnShow;
    var btnAdd;
    var btnpriv;
    var btnUpdate;
    var btnUpdate2;
    var btnUpdate3;
    var btnSave_1;
    var btnSave_2;
    var btnSave_3;
    var btnBack_1;
    var btnBack_2;
    var btnBack_3;
    var drp_G_Store;
    var txtCat_Type;
    var drpPaymentType;
    var searchbutmemreport;
    var UOMID = 0;
    var flag = 'i';
    var flagqty = 1;
    var compcode;
    var BranchCode;
    var catId = "0";
    var ItemFamilyID = "0";
    var storeCode = 1;
    var uomgrpid = "0";
    var qtytype = 1;
    var LikeDesc = "";
    var LikeCode = "";
    var containdesc = "";
    var containcode = "";
    var FinYear = Number(SysSession.CurrentEnvironment.CurrentYear);
    var lang = (SysSession.CurrentEnvironment.ScreenLanguage);
    var ItemID = 0;
    var classRetail = "";
    var classwhole = "";
    function InitalizeComponent() {
        // 
        if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
            document.getElementById('Screen_name').innerHTML = "تعريف الأصناف";
        }
        else {
            document.getElementById('Screen_name').innerHTML = "Items";
        }
        compcode = Number(SysSession.CurrentEnvironment.CompCode);
        BranchCode = Number(SysSession.CurrentEnvironment.BranchCode);
        InitalizeControls();
        InitalizeEvents();
        Display_I_ItemFamily();
        FillddlCategoryType();
        Fillddl_G_store();
        Filldrp_UnitGroup();
        Display_UOM();
        $('#drp_G_Store').prop("selectedIndex", 1);
        $("#drp_G_Store").attr("disabled", "disabled");
        $("#drpitem_family").attr("disabled", "disabled");
        btnShow_onclick();
    }
    StkDefItemsNew.InitalizeComponent = InitalizeComponent;
    function InitalizeControls() {
        //----------------------------------------------------------------------------------( Buttons )
        btnUpdate2 = document.getElementById("btnUpdate2");
        btnUpdate3 = document.getElementById("btnUpdate3");
        btnSave_1 = document.getElementById("btnSave_1");
        btnSave_2 = document.getElementById("btnSave_2");
        btnSave_3 = document.getElementById("btnSave_3");
        btnBack_1 = document.getElementById("btnBack_1");
        btnBack_2 = document.getElementById("btnBack_2");
        btnBack_3 = document.getElementById("btnBack_3");
        btnUpdate = document.getElementById("btnUpdate");
        btnShow = document.getElementById("btnShow");
        btnpriv = document.getElementById("btnpriv");
        btnAdd = document.getElementById("btnAdd");
        //-------------------------------------------------------------------------------------( Selectors )
        drpPaymentType = document.getElementById("drpPaymentType");
        txtCat_Type = document.getElementById("txtCat_Type");
        drp_G_Store = document.getElementById("drp_G_Store");
        //--------------------------------------------------------------------------------------( Inputs )
        searchbutmemreport = document.getElementById("searchbutmemreport");
    }
    function InitalizeEvents() {
        txtCat_Type.onchange = txtCat_Type_onchange;
        searchbutmemreport.onkeyup = searchbutmemreport_onkeyup;
        btnSave_1.onclick = btnSave_1_onclick;
        btnSave_2.onclick = btnSave_2_onclick;
        btnSave_3.onclick = btnSave_3_onclick;
        btnBack_1.onclick = btnBack_1_onclick;
        btnBack_2.onclick = btnBack_2_onclick;
        btnBack_3.onclick = btnBack_3_onclick;
        btnUpdate2.onclick = btnUpdate2_onclick;
        btnUpdate3.onclick = btnUpdate3_onclick;
        btnUpdate.onclick = btnUpdate_onclick;
        btnShow.onclick = btnShow_onclick;
        btnpriv.onclick = btnpriv_onclick;
        btnAdd.onclick = btnAdd_onclick;
        $("#drpPaymentType").on('change', function () {
            if ($("#drpPaymentType").val() == "0") {
                $("#div_Data").html('');
                $("#drpitem_family").attr("disabled", "disabled");
                $('#drpitem_family').prop("value", '0');
            }
            else {
                storeCode = $('#drp_G_Store').val();
                $("#drpitem_family").removeAttr("disabled");
                $('#drpitem_family').html("");
                catId = $('#drpPaymentType').val();
                DisplayStk_I_Item();
                ItemFamilyID = $('#drpitem_family').val();
            }
        });
        $("#drpitem_family").on('change', function () {
            ItemFamilyID = $('#drpitem_family').val();
        });
        $("#drp_G_Store").on('change', function () {
            $("#drpPaymentType").removeAttr("disabled");
            storeCode = $('#drp_G_Store').val();
        });
    }
    //----------------------------------------------------------------------( fill ddl )
    function Fillddl_G_store() {
        //var StkDefCategory: Array<I_D_Category> = new Array<I_D_Category>();
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("StkDefStore", "GetAll"),
            data: {
                CompCode: compcode, BranchCode: BranchCode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    Display_STORE = result.Response;
                    DocumentActions.FillCombowithdefult(Display_STORE, drp_G_Store, "StoreId", (lang == "ar" ? "DescA" : "DescL"), (lang == "ar" ? "اختر المستودع" : "Select store"));
                }
            }
        });
    }
    function FillddlCategoryType() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("StkDefCategory", "GetAll"),
            data: {
                CompCode: compcode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    Display_Type = result.Response;
                    $('#drpPaymentType').append('<option value="' + 0 + '"> ' + (lang == "ar" ? " اختر الفئة " : "Choose Category") + '</option>');
                    for (var i = 0; i < Display_Type.length; i++) {
                        $('#drpPaymentType').append('<option value="' + Display_Type[i].CatID + '">' + (lang == "ar" ? Display_Type[i].DescA : Display_Type[i].DescL) + '</option>');
                    }
                    DocumentActions.FillCombowithdefult(Display_Type, txtCat_Type, "CatID", (lang == "ar" ? "DescA" : "DescL"), (lang == "ar" ? "اختر  الفئه" : "Select Category"));
                }
            }
        });
    }
    function Display_I_ItemFamily() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("StkDefItemType", "GetAllNew"),
            data: {
                CompCode: compcode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    Display_ItemFamily = result.Response;
                    DisplayStk_I_Item();
                }
            }
        });
    }
    function DisplayStk_I_Item() {
        $('#drpitem_family').append('<option value="0"> ' + (lang == "ar" ? " اختر النوع " : "Choose Type") + '</option>');
        Display_ItemFamilynew = Display_ItemFamily.filter(function (x) { return x.CatID == Number(drpPaymentType.value); });
        for (var i = 0; i < Display_ItemFamilynew.length; i++) {
            $('#drpitem_family').append('<option value="' + Display_ItemFamilynew[i].ItemFamilyID + '">' + (lang == "ar" ? Display_ItemFamilynew[i].DescA : Display_ItemFamilynew[i].DescL) + '</option>');
            $('#txtFamily').append('<option value="' + Display_ItemFamilynew[i].ItemFamilyID + '">' + (lang == "ar" ? Display_ItemFamilynew[i].DescA : Display_ItemFamilynew[i].DescL) + '</option>');
        }
    }
    function Filldrp_UnitGroup() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("I_D_UnitGroup", "GetAllUnitGroup"),
            data: {
                CompCode: compcode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    detailunitgrp = result.Response;
                    $('#drp_UnitGroup').append('<option value="' + 0 + '"> ' + (lang == "ar" ? " اختر مجموعة الوحدة " : "Choose Unit Group") + '</option>');
                    $('#txtGroupofUnits').append('<option value="' + 0 + '"> ' + (lang == "ar" ? " اختر مجموعة الوحدة " : "Choose Unit Group") + '</option>');
                    if (sys.SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
                        for (var i = 0; i < detailunitgrp.length; i++) {
                            $('#drp_UnitGroup').append('<option value="' + detailunitgrp[i].UnitGrpID + '">' + detailunitgrp[i].DescA + '</option>');
                            $('#txtGroupofUnits').append('<option value="' + detailunitgrp[i].UnitGrpID + '">' + detailunitgrp[i].DescA + '</option>');
                        }
                    }
                    else {
                        for (var i = 0; i < detailunitgrp.length; i++) {
                            $('#drp_UnitGroup').append('<option value="' + detailunitgrp[i].UnitGrpID + '">' + detailunitgrp[i].DescE + '</option>');
                            $('#txtGroupofUnits').append('<option value="' + detailunitgrp[i].UnitGrpID + '">' + detailunitgrp[i].DescE + '</option>');
                        }
                    }
                }
            }
        });
    }
    function Display_UOM() {
        //var StkDefCategory: Array<I_D_Category> = new Array<I_D_Category>();
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("StkDefUnit", "GetAll"),
            data: {
                CompCode: compcode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    Display_D_UOM = result.Response;
                    Display_D_UOMnew = Display_D_UOM.filter(function (x) { return x.CompCode = Number(compcode); });
                    $('#txtPolice_num').append('<option value="0"> ' + (lang == "ar" ? " اختر الوحدة الاساسية " : "Choose The Base Unit") + '</option>');
                    for (var i = 0; i < Display_D_UOMnew.length; i++) {
                        $('#txtPolice_num').append('<option value="' + Display_D_UOMnew[i].UomID + '">' + (lang == "ar" ? Display_D_UOMnew[i].DescA : Display_D_UOMnew[i].DescE) + '</option>');
                    }
                }
            }
        });
    }
    //----------------------------------------------------------------------( Validate & Movments )
    function searchbutmemreport_onkeyup() {
        if (searchbutmemreport.value != "") {
            var search_1 = searchbutmemreport.value.toLowerCase();
            SearchDetails = Details.filter(function (x) { return x.ItemCode.toLowerCase().toString().search(search_1) >= 0 || x.DescA.toString().toLowerCase().search(search_1) >= 0
                || x.DescL.toLowerCase().search(search_1) >= 0 || x.cat_DescA.toLowerCase().search(search_1) >= 0
                || x.Cat_DescE.toLowerCase().search(search_1) >= 0 || x.fm_DescA.toLowerCase().search(search_1) >= 0
                || x.uom_DescA.toString().search(search_1) >= 0 || x.Uom_DescE.search(search_1) >= 0
                || x.BranchQty.toString().search(search_1) >= 0 || x.CompQty.toString().search(search_1) >= 0; });
            divMasterGrid.DataSource = SearchDetails;
            divMasterGrid.Bind();
        }
        else {
            divMasterGrid.DataSource = Details;
            divMasterGrid.Bind();
        }
    }
    function btnpriv_onclick() {
        if (btnpriv.innerText == "عرض الكميات المتاحة فقط") {
            btnpriv.innerText = "عرض جميع الكميات ";
            flagqty = 0;
            DetailsQtyfilter = DetailsQty.filter(function (x) { return x.OnhandQty > 0 || x.OnOrderQty > 0 || x.OnRoadQty > 0; });
            InitializeGridQty();
            divGrid1.DataSource = DetailsQtyfilter;
            divGrid1.Bind();
        }
        else {
            btnpriv.innerText = "عرض الكميات المتاحة فقط";
            flagqty = 1;
            InitializeGridQty();
            divGrid1.DataSource = DetailsQty;
            divGrid1.Bind();
        }
    }
    function txtCat_Type_onchange() {
        if (txtCat_Type.value != 'null') {
            $('#txtFamily').removeAttr('disabled');
        }
        else {
            $('#txtFamily').attr('disabled', 'disabled');
        }
        $('#txtFamily').html('');
        Display_ItemFamilynew1 = new Array();
        Display_ItemFamilynew1 = Display_ItemFamily.filter(function (x) { return x.CatID == Number(txtCat_Type.value); });
        for (var i = 0; i < Display_ItemFamilynew1.length; i++) {
            $('#txtFamily').append('<option value="' + Display_ItemFamilynew1[i].ItemFamilyID + '">' + (lang == "ar" ? Display_ItemFamilynew1[i].DescA : Display_ItemFamilynew1[i].DescL) + '</option>');
        }
        Display_Typefilter = new Array();
        Display_Typefilter = Display_Type.filter(function (x) { return x.CatID == Number(txtCat_Type.value); });
        if (txtCat_Type.value != 'null') {
            $('#txtGroupofUnits').val(Display_Typefilter[0].UnitGrpID);
        }
        else {
            $('#txtGroupofUnits').val('0');
            $('#txtPolice_num').val('0');
        }
        detailunitgrpfilter = new Array();
        detailunitgrpfilter = detailunitgrp.filter(function (x) { return x.UnitGrpID == Number($('#txtGroupofUnits').val()); });
        if ($('#txtGroupofUnits').val() != '0') {
            $('#txtPolice_num').val(detailunitgrpfilter[0].UomID);
        }
        else {
            $('#txtPolice_num').val('0');
        }
    }
    function cleardisabled() {
        $('#txtItemCode').removeAttr('disabled');
        $('#txtItm_DescA').removeAttr('disabled');
        $('#txtItm_DescE').removeAttr('disabled');
        $('#txtCat_Type').removeAttr('disabled');
        $('#txtFamily').removeAttr('disabled');
        $('#txtRefItemCode').removeAttr('disabled');
    }
    function adddisabled() {
        $('#txtItemCode').attr('disabled', 'disabled');
        $('#txtItm_DescA').attr('disabled', 'disabled');
        $('#txtItm_DescE').attr('disabled', 'disabled');
        $('#txtCat_Type').attr('disabled', 'disabled');
        $('#txtFamily').attr('disabled', 'disabled');
        $('#txtGroupofUnits').attr('disabled', 'disabled');
        $('#txtPolice_num').attr('disabled', 'disabled');
        $('#txtRefItemCode').attr('disabled', 'disabled');
    }
    function clearinputs() {
        $('#txtItemCode').val('');
        $('#txtItm_DescA').val('');
        $('#txtItm_DescE').val('');
        $('#txtCat_Type').val('null');
        $('#txtFamily').val('1');
        $('#txtRefItemCode').val('0');
        $('#txtGlobalCost').val('0');
        $('#txtStarGlobalCost').val('0');
    }
    function ValidationHeader() {
        var det = Details.filter(function (x) { return x.ItemCode == $('#txtItemCode').val(); });
        if (det.length > 0) {
            DisplayMassage_Processes("كود الصنف موجود من قبل", "Code of Item was found ", MessageType.Worning);
            Errorinput($('#txtItemCode'));
            return false;
        }
        if ($('#txtItemCode').val().trim() == "") {
            DisplayMassage_Processes("برجاء أدخل كود الصنف  !", "Must Enter Code Of Item !", MessageType.Worning);
            Errorinput($('#txtItemCode'));
            return false;
        }
        if ($('#txtItm_DescA').val().trim() == "" && $('#txtItm_DescE').val().trim() == "") {
            DisplayMassage_Processes(" برجاء أدخل الوصف !", "Must Enter The Describtion !", MessageType.Worning);
            Errorinput($('#txtItm_DescA'));
            Errorinput($('#txtItm_DescE'));
            return false;
        }
        if ($('#txtCat_Type').val() == "null") {
            DisplayMassage_Processes(" برجاء اختيار الفئة!", "Must Choose Category!", MessageType.Worning);
            Errorinput($('#txtCat_Type'));
            return false;
        }
        return true;
    }
    //---------------------------------------------------------------------( Div I_Item )     
    function btnShow_onclick() {
        //printDiv('printableArea');
        $('#searchbutmemreport').val('');
        storeCode = Number($('#drp_G_Store').val());
        catId = $('#drpPaymentType').val();
        ItemFamilyID = $('#drpitem_family').val();
        uomgrpid = $('#drp_UnitGroup').val();
        qtytype = Number($('#drp_Qty').val());
        LikeDesc = $('#Likedesc').val();
        LikeCode = $('#Likecode').val();
        containdesc = $('#drpcontaindesc').val();
        containcode = $('#drpcontaincode').val();
        Display();
    }
    function Display() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("StkDefItems", "GetAll_Item_Proc"),
            data: {
                CompCode: compcode, FinYear: FinYear, Branch: BranchCode, storeCode: storeCode, catid: catId, ItemFamilyID: ItemFamilyID, uomgrpid: uomgrpid, qtytype: qtytype, LikeDesc: LikeDesc, LikeCode: LikeCode, containdesc: containdesc, containcode: containcode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    Details = result.Response;
                    InitializeGrid();
                    divMasterGrid.DataSource = Details;
                    divMasterGrid.Bind();
                    $('#id_divMasterGrid').removeClass('display_none');
                }
            }
        });
    }
    function InitializeGrid() {
        //$("#divMasterGrid").attr("style", "");
        var res = GetResourceList("");
        divMasterGrid.ElementName = "divMasterGrid";
        divMasterGrid.Paging = true;
        divMasterGrid.PageSize = 10;
        divMasterGrid.Sorting = true;
        divMasterGrid.InsertionMode = JsGridInsertionMode.Binding;
        divMasterGrid.Editing = false;
        divMasterGrid.Inserting = false;
        divMasterGrid.SelectedIndex = 1;
        divMasterGrid.OnRowDoubleClicked = MasterGridDoubleClick;
        divMasterGrid.PrimaryKey = "ItemID";
        divMasterGrid.Columns = [
            { title: "ID", name: "ItemID", type: "text", width: "2%", visible: false },
            { title: 'رقم الصنف', name: "ItemCode", type: "text", width: "10%" },
            { title: 'الوصف', name: (lang == "ar" ? "DescA" : "DescL"), type: "text", width: "35%" },
            { title: 'الفئة', name: (lang == "ar" ? "cat_DescA" : "Cat_DescE"), type: "text", width: "12%" },
            { title: 'الصنف الرئيسي', name: (lang == "ar" ? "fm_DescA" : "fm_DescE"), type: "text", width: "14%" },
            { title: 'الوحدة الرئيسية', name: (lang == "ar" ? "uom_DescA" : "Uom_DescE"), type: "text", width: "16%" },
            { title: 'الكمية  في الفرع ', name: "BranchQty", type: "text", width: "13%" },
            { title: 'الكمية في الشركة ', name: "CompQty", type: "text", width: "13%" },
        ];
    }
    function MasterGridDoubleClick() {
        DisplayStk_I_Item();
        Selected_Data = new Array();
        Selected_Data = Details.filter(function (x) { return x.ItemID == Number(divMasterGrid.SelectedKey); });
        ItemID = Selected_Data[0].ItemID;
        $("#div_Master_Hedr").removeClass("display_none");
        DisplayData(Selected_Data);
        $('#Div_Show_units').removeClass('display_none');
        $('#Div_Show_Quantity').removeClass('display_none');
        if (SysSession.CurrentPrivileges.CUSTOM2 == false) {
            $('#costdiv').addClass('display_none');
        }
        else {
            $('#costdiv').removeClass('display_none');
        }
        $('#txtFamily').html('');
        Display_ItemFamilynew1 = Display_ItemFamily.filter(function (x) { return x.CatID == Number(txtCat_Type.value); });
        for (var i = 0; i < Display_ItemFamilynew1.length; i++) {
            $('#txtFamily').append('<option value="' + Display_ItemFamilynew1[i].ItemFamilyID + '">' + (lang == "ar" ? Display_ItemFamilynew1[i].DescA : Display_ItemFamilynew1[i].DescL) + '</option>');
        }
    }
    function DisplayData(Selected_Data) {
        DocumentActions.RenderFromModel(Selected_Data[0]);
        $('#Div_Show_units').addClass('display_none');
        $('#Div_Show_Quantity').addClass('display_none');
        DisplayUnits();
        DisplayQty();
    }
    function btnAdd_onclick() {
        flag = 'i';
        Display_I_ItemFamily();
        $("#div_Master_Hedr").removeClass("display_none");
        $("#btnUpdate").addClass("display_none");
        $("#Div_Show_units").addClass("disabledDiv");
        $("#Div_Show_Quantity").addClass("disabledDiv");
        $('#div_dis').addClass('disabledDiv');
        $('#btnBack_1').removeClass('display_none');
        $('#btnSave_1').removeClass('display_none');
        cleardisabled();
        clearinputs();
        $('#txtFamily').attr('disabled', 'disabled');
        txtCat_Type_onchange();
    }
    function btnUpdate_onclick() {
        flag = 'u';
        $('#btnBack_1').removeClass('display_none');
        $('#btnSave_1').removeClass('display_none');
        $('#btnUpdate').addClass('display_none');
        $('#div_dis').addClass('disabledDiv');
        $('#Div_Show_Quantity').addClass('disabledDiv');
        $('#Div_Show_units').addClass('disabledDiv');
        cleardisabled();
        $('#txtCat_Type').attr('disabled', 'disabled');
        $('#txtGroupofUnits').attr('disabled', 'disabled');
        $('#txtPolice_num').attr('disabled', 'disabled');
    }
    function btnSave_1_onclick() {
        if (flag == "i") {
            if (!ValidationHeader())
                return;
            Insert();
            Display();
        }
        else {
            Update();
            Display();
        }
        adddisabled();
    }
    function btnBack_1_onclick() {
        if (flag == "i") {
            $("#div_Master_Hedr").addClass("display_none");
            $("#btnUpdate").removeClass("display_none");
            $("#Div_Show_units").removeClass("disabledDiv");
            $("#Div_Show_Quantity").removeClass("disabledDiv");
            $("#Div_Show_units").addClass("display_none");
            $("#Div_Show_Quantity").addClass("display_none");
            $('#div_dis').removeClass('disabledDiv');
            $('#btnBack_1').addClass('display_none');
            $('#btnSave_1').addClass('display_none');
        }
        else {
            $('#btnBack_1').addClass('display_none');
            $('#btnSave_1').addClass('display_none');
            $('#btnUpdate').removeClass('display_none');
            $('#div_dis').removeClass('disabledDiv');
            $('#Div_Show_Quantity').removeClass('disabledDiv');
            $('#Div_Show_units').removeClass('disabledDiv');
        }
        MasterGridDoubleClick();
        adddisabled();
    }
    function Assign() {
        if ($('#txtItm_DescA').val().trim() == "" && $('#txtItm_DescE').val() != "") {
            $('#txtItm_DescA').val($('#txtItm_DescE').val());
        }
        if ($('#txtItm_DescA').val() != "" && $('#txtItm_DescE').val().trim() == "") {
            $('#txtItm_DescE').val($('#txtItm_DescA').val());
        }
        Model = new I_Item();
        DocumentActions.AssignToModel(Model);
        if (flag == 'i') {
            Model.CompCode = Number(SysSession.CurrentEnvironment.CompCode);
            Model.CreatedBy = SysSession.CurrentEnvironment.UserCode;
            Model.CreatedAt = DateTimeFormat(Date().toString());
            Model.ItemID = 0;
            if (true) {
            }
            Model.FirstYear = Number(sys.SysSession.CurrentEnvironment.CurrentYear);
        }
        else {
            Model.CompCode = Number(SysSession.CurrentEnvironment.CompCode);
            Model.CreatedBy = SysSession.CurrentEnvironment.UserCode;
            Model.CreatedAt = DateTimeFormat(Date().toString());
            Model.ItemID = ItemID;
            Model.FirstYear = Number(sys.SysSession.CurrentEnvironment.CurrentYear);
            if ($('#txtItm_DescA').val().trim() == "" && $('#txtItm_DescE').val().trim() != "") {
                Model.DescL = $('#txtItm_DescA').val();
            }
            if ($('#txtItm_DescA').val().trim() != "" && $('#txtItm_DescE').val().trim() == "") {
                Model.DescA = $('#txtItm_DescE').val();
            }
        }
    }
    function Insert() {
        Assign();
        Ajax.Callsync({
            type: "Post",
            url: sys.apiUrl("StkDefItems", "Insert"),
            data: JSON.stringify(Model),
            success: function (d) {
                var result = d;
                if (result.IsSuccess == true) {
                    var itemid = result.Response;
                    DisplayMassage_Processes('تم الحقظ بنجاح', 'saved', MessageType.Succeed);
                    $("#div_Master_Hedr").addClass("display_none");
                    $("#btnUpdate").removeClass("display_none");
                    $("#Div_Show_units").removeClass("disabledDiv");
                    $("#Div_Show_Quantity").removeClass("disabledDiv");
                    $("#Div_Show_units").addClass("display_none");
                    $("#Div_Show_Quantity").addClass("display_none");
                    $('#div_dis').removeClass('disabledDiv');
                    $('#btnBack_1').addClass('display_none');
                    $('#btnSave_1').addClass('display_none');
                }
                else {
                    DisplayMassage_Processes('خطأ', 'Wrong', MessageType.Worning);
                }
            }
        });
    }
    function Update() {
        Assign();
        Ajax.Callsync({
            type: "Post",
            url: sys.apiUrl("StkDefItems", "Update"),
            data: JSON.stringify(Model),
            success: function (d) {
                var result = d;
                if (result.IsSuccess == true) {
                    var itemid = result.Response;
                    DisplayMassage_Processes('تم الحقظ بنجاح', 'saved', MessageType.Succeed);
                    $('#btnBack_1').addClass('display_none');
                    $('#btnSave_1').addClass('display_none');
                    $('#btnUpdate').removeClass('display_none');
                    $('#div_dis').removeClass('disabledDiv');
                    $('#Div_Show_Quantity').removeClass('disabledDiv');
                    $('#Div_Show_units').removeClass('disabledDiv');
                }
                else {
                    DisplayMassage_Processes('خطأ', 'Wrong', MessageType.Worning);
                }
            }
        });
    }
    //---------------------------------------------------------------------( Div I_ItemYearuom )
    function DisplayUnits() {
        var ItemID = Number(divMasterGrid.SelectedKey);
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("I_D_UnitGroup", "GetIQ_GetItemYearUom"),
            data: { ItemID: ItemID, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    Detailsunit = result.Response;
                    for (var i = 0; i < Detailsunit.length; i++) {
                        Detailsunit[i].IsPurchasedes = Detailsunit[i].IsPurchase == true ? "نعم" : 'لا';
                        Detailsunit[i].IsRetailSalesdes = Detailsunit[i].IsRetailSales == true ? "نعم" : 'لا';
                        Detailsunit[i].IsStockdes = Detailsunit[i].IsStock == true ? "نعم" : 'لا';
                        Detailsunit[i].IsWholeSalesdes = Detailsunit[i].IsWholeSales == true ? "نعم" : 'لا';
                    }
                    InitializeGridUnit();
                    divGrid1.DataSource = Detailsunit;
                    divGrid1.Bind();
                    $('#divGrid1').removeClass('display_none');
                }
            }
        });
    }
    function InitializeGridUnit() {
        var res = GetResourceList("");
        divGrid1.ElementName = "divGrid1";
        divGrid1.Paging = true;
        divGrid1.PageSize = 10;
        //divGrid1.Sorting = true;
        divGrid1.InsertionMode = JsGridInsertionMode.Binding;
        divGrid1.Editing = false;
        divGrid1.Inserting = false;
        divGrid1.SelectedIndex = 1;
        //divGrid1.OnRowDoubleClicked = divGridDoubleClick;
        divGrid1.PrimaryKey = "UomId";
        divGrid1.Columns = [
            { title: "ID", name: "ItemYearUomID", type: "text", width: "2%", visible: false },
            //{ title: "flag", name: "Statusflag", type: "text", width: "2%", visible: false },   
            { title: 'الوحدة', name: (lang == "ar" ? "DescA" : "DescE"), type: "text", width: "15%" },
            { title: 'معامل التحويل', name: "Rate", type: "number", width: "10%" },
            {
                title: 'سعربيع تجزئة', name: "UnitPrice", type: "number", width: "10%",
                itemTemplate: function (s, item) {
                    var txt = document.createElement("input");
                    txt.type = "Number";
                    txt.id = "UnitPrice" + item.UomId;
                    txt.name = "UnitPrice";
                    txt.disabled = true;
                    classRetail = item.IsRetailSales == false ? "" : "classDescunit";
                    txt.className = "form-control input-sm " + classRetail + "  ";
                    txt.value = item.UnitPrice.toString();
                    txt.setAttribute('val', item.UnitPrice.toString());
                    txt.onchange = function (e) {
                        item.Statusflag = "u";
                        var min = Number($("#MinUnitPrice" + item.UomId + "").val());
                        var max = Number($("#UnitPrice" + item.UomId + "").val());
                        if (min >= max || $("#UnitPrice" + item.UomId + "").val().trim() == "") {
                            DisplayMassage_Processes("لا يمكن ان يكون اقل سعر بيع تجزئة اكبر من او يساوى سعر بيع جملة", "The lowest retail price cannot be greater than or equal to the wholesale price", MessageType.Worning);
                            Errorinput($("#MinUnitPrice" + item.UomId + ""));
                            $("#MinUnitPrice" + item.UomId + "").val(max - 1);
                        }
                        item.UnitPrice = Number(txt.value);
                    };
                    return txt;
                }
            },
            {
                title: 'اقل سعر بيع تجزئة', name: "MinUnitPrice", type: "text", width: "10%",
                itemTemplate: function (s, item) {
                    var txt = document.createElement("input");
                    txt.type = "Number";
                    txt.id = "MinUnitPrice" + item.UomId;
                    txt.name = "MinUnitPrice";
                    txt.disabled = true;
                    classRetail = item.IsRetailSales == false ? "" : "classDescunit";
                    txt.className = "form-control input-sm " + classRetail + "  ";
                    txt.value = item.MinUnitPrice.toString();
                    txt.setAttribute('val', item.MinUnitPrice.toString());
                    txt.onchange = function (e) {
                        item.Statusflag = "u";
                        var min = Number($("#MinUnitPrice" + item.UomId + "").val());
                        var max = Number($("#UnitPrice" + item.UomId + "").val());
                        if (min >= max || $("#MinUnitPrice" + item.UomId + "").val().trim() == "") {
                            DisplayMassage_Processes("لا يمكن ان يكون اقل سعر بيع تجزئة اكبر من او يساوى سعر بيع جملة", "The lowest retail price cannot be greater than or equal to the wholesale price", MessageType.Worning);
                            Errorinput($("#MinUnitPrice" + item.UomId + ""));
                            $("#MinUnitPrice" + item.UomId + "").val(max - 1);
                        }
                        item.MinUnitPrice = Number(txt.value);
                    };
                    return txt;
                }
            },
            {
                title: 'سعر بيع جملة', name: "UnitWholePrice", type: "number", width: "10%",
                itemTemplate: function (s, item) {
                    var txt = document.createElement("input");
                    txt.type = "Number";
                    txt.id = "UnitWholePrice" + item.UomId;
                    txt.name = "UnitWholePrice";
                    txt.disabled = true;
                    classwhole = item.IsWholeSales == false ? "" : "classDescunit";
                    txt.className = "form-control input-sm " + classwhole + " ";
                    txt.value = item.UnitWholePrice.toString();
                    txt.setAttribute('val', item.UnitWholePrice.toString());
                    txt.onchange = function (e) {
                        item.Statusflag = "u";
                        var min = Number($("#MinUnitWholePrice" + item.UomId + "").val());
                        var max = Number($("#UnitWholePrice" + item.UomId + "").val());
                        if (min >= max || $("#UnitWholePrice" + item.UomId + "").val().trim() == "") {
                            DisplayMassage_Processes("لا يمكن ان يكون اقل سعر بيع تجزئة اكبر من او يساوى سعر بيع جملة", "The lowest retail price cannot be greater than or equal to the wholesale price", MessageType.Worning);
                            Errorinput($("#MinUnitWholePrice" + item.UomId + ""));
                            $("#MinUnitWholePrice" + item.UomId + "").val(max - 1);
                        }
                        item.UnitWholePrice = Number(txt.value);
                    };
                    return txt;
                }
            },
            {
                title: 'اقل سعر بيع جملة', name: "MinUnitWholePrice", type: "number", width: "10%",
                itemTemplate: function (s, item) {
                    var txt = document.createElement("input");
                    txt.type = "Number";
                    txt.id = "MinUnitWholePrice" + item.UomId;
                    txt.name = "MinUnitWholePrice";
                    txt.disabled = true;
                    classwhole = item.IsWholeSales == false ? "" : "classDescunit";
                    txt.className = "form-control input-sm " + classwhole + " ";
                    txt.value = item.MinUnitWholePrice.toString();
                    txt.setAttribute('val', item.MinUnitWholePrice.toString());
                    txt.onchange = function (e) {
                        item.Statusflag = "u";
                        var min = Number($("#MinUnitWholePrice" + item.UomId + "").val());
                        var max = Number($("#UnitWholePrice" + item.UomId + "").val());
                        if (min >= max || $("#MinUnitWholePrice" + item.UomId + "").val().trim() == "") {
                            DisplayMassage_Processes("لا يمكن ان يكون اقل سعر بيع تجزئة اكبر من او يساوى سعر بيع جملة", "The lowest retail price cannot be greater than or equal to the wholesale price", MessageType.Worning);
                            Errorinput($("#MinUnitWholePrice" + item.UomId + ""));
                            $("#MinUnitWholePrice" + item.UomId + "").val(max - 1);
                        }
                        item.MinUnitWholePrice = Number(txt.value);
                    };
                    return txt;
                }
            },
            { title: 'بيع تجزئه', name: "IsRetailSalesdes", type: "text", width: "5%" },
            { title: 'بيع جملة', name: "IsWholeSalesdes", type: "text", width: "5%" },
            { title: 'مشتريات', name: "IsPurchasedes", type: "text", width: "5%" },
            { title: 'مخزون', name: "IsStockdes", type: "text", width: "5%" },
        ];
        //UOMID= Number(divGrid1.SelectedKey);
    }
    function btnUpdate2_onclick() {
        $('#btnBack_2').removeClass('display_none');
        $('#btnSave_2').removeClass('display_none');
        $('#btnUpdate2').addClass('display_none');
        $('#div_dis').addClass('disabledDiv');
        $('#Div_Show_Quantity').addClass('disabledDiv');
        $('#id_divGridDetails').addClass('disabledDiv');
        $('.classDescunit').removeAttr('disabled');
    }
    function btnSave_2_onclick() {
        Update2();
        DisplayUnits();
    }
    function btnBack_2_onclick() {
        $('#btnBack_2').addClass('display_none');
        $('#btnSave_2').addClass('display_none');
        $('#btnUpdate2').removeClass('display_none');
        $('#div_dis').removeClass('disabledDiv');
        $('.classDescunit').attr('disabled', 'disabled');
        $('#Div_Show_Quantity').removeClass('disabledDiv');
        $('#id_divGridDetails').removeClass('disabledDiv');
        DisplayUnits();
    }
    function Assign2() {
        debugger;
        var data_Taple = Detailsunit.filter(function (x) { return x.Statusflag == "u"; });
        ModelDetial = new Array();
        for (var i = 0; i < data_Taple.length; i++) {
            Modelyear = new I_ItemYearUom;
            debugger;
            Modelyear.FinYear = Number(data_Taple[i].FinYear);
            Modelyear.ItemID = Number(data_Taple[i].ItemID);
            Modelyear.ItemYearUomID = Number(data_Taple[i].ItemYearUomID);
            Modelyear.MinUnitPrice = Number(data_Taple[i].MinUnitPrice);
            Modelyear.MinUnitWholePrice = Number(data_Taple[i].MinUnitWholePrice);
            Modelyear.UnitPrice = Number(data_Taple[i].UnitPrice);
            Modelyear.UnitWholePrice = Number(data_Taple[i].UnitWholePrice);
            Modelyear.UomId = Number(data_Taple[i].UomId);
            ModelDetial.push(Modelyear);
        }
    }
    function Update2() {
        Assign2();
        Ajax.Callsync({
            type: "Post",
            url: sys.apiUrl("I_ItemYearUomDef", "Update"),
            data: JSON.stringify(ModelDetial),
            success: function (d) {
                var result = d;
                if (result.IsSuccess == true) {
                    var itemid = result.Response;
                    DisplayMassage_Processes('تم الحقظ بنجاح', 'saved', MessageType.Succeed);
                    $('#btnBack_2').addClass('display_none');
                    $('#btnSave_2').addClass('display_none');
                    $('#btnUpdate2').removeClass('display_none');
                    $('.classDescunit').attr('disabled', 'disabled');
                    $('#div_dis').removeClass('disabledDiv');
                    $('#Div_Show_Quantity').removeClass('disabledDiv');
                    $('#id_divGridDetails').removeClass('disabledDiv');
                }
                else {
                    DisplayMassage_Processes('خطأ', 'Wrong', MessageType.Worning);
                }
            }
        });
    }
    //---------------------------------------------------------------------( Div I_ItemStore )  
    function DisplayQty() {
        var ItemID = Number(divMasterGrid.SelectedKey);
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("I_D_UnitGroup", "GetIQ_GetItemStore"),
            data: { Compcode: compcode, BranchCode: BranchCode, ItemID: ItemID, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    DetailsQty = result.Response;
                    if (SysSession.CurrentPrivileges.CUSTOM1 == false) {
                        $('#btnpriv').addClass('display_none');
                        DetailsQtyfilter = DetailsQty.filter(function (x) { return x.BraCode == BranchCode; });
                        InitializeGridQty();
                        divGrid1.DataSource = DetailsQtyfilter;
                        divGrid1.Bind();
                    }
                    else {
                        $('#btnpriv').removeClass('display_none');
                        InitializeGridQty();
                        divGrid1.DataSource = DetailsQty;
                        divGrid1.Bind();
                        $('#divGrid3').removeClass('display_none');
                    }
                }
            }
        });
    }
    function InitializeGridQty() {
        var res = GetResourceList("");
        divGrid1.ElementName = "divGrid3";
        divGrid1.Paging = true;
        divGrid1.PageSize = 10;
        //divGrid1.Sorting = true;
        divGrid1.InsertionMode = JsGridInsertionMode.Binding;
        divGrid1.Editing = false;
        divGrid1.Inserting = false;
        divGrid1.SelectedIndex = 1;
        //divGrid1.OnRowDoubleClicked = divGridDoubleClick;
        divGrid1.PrimaryKey = "ItemID";
        divGrid1.Columns = [
            { title: "ID", name: "ItemStoreID", type: "text", width: "2%", visible: false },
            { title: 'الفرع', name: (lang == "ar" ? "BRA_DESC" : "BRA_DESCL"), type: "text", width: "14%" },
            { title: 'المستودع', name: (lang == "ar" ? "St_DescA" : "st_DescE"), type: "text", width: "14%" },
            {
                title: 'الموقع ', name: (lang == "ar" ? "LOCATION" : "LOCATION2"), type: "text", width: "12%",
                itemTemplate: function (s, item) {
                    var txt = document.createElement("input");
                    txt.type = "input";
                    txt.id = "LOCATION" + item.ItemID;
                    txt.name = "LOCATION";
                    txt.disabled = true;
                    txt.className = "form-control input-sm classDescQTY";
                    txt.value = (lang == "ar" ? item.LOCATION : item.LOCATION2);
                    txt.setAttribute('val', item.LOCATION);
                    txt.onchange = function (e) {
                        item.Statusflag = "u";
                        item.LOCATION = txt.value;
                    };
                    return txt;
                }
            },
            {
                title: 'اقل كمية ', name: "MinQty", type: "number", width: "10%",
                itemTemplate: function (s, item) {
                    var txt = document.createElement("input");
                    txt.type = "input";
                    txt.id = "MinQty" + item.ItemID;
                    txt.name = "MinQty";
                    txt.disabled = true;
                    txt.className = "form-control input-sm classDescQTY";
                    txt.value = item.MinQty.toString();
                    txt.setAttribute('val', item.MinQty.toString());
                    txt.onchange = function (e) {
                        item.Statusflag = "u";
                        var min = Number($("#MinQty" + item.ItemID + "").val());
                        var max = Number($("#MaxQty" + item.ItemID + "").val());
                        if (min >= max || $("#MinQty" + item.ItemID + "").val().trim() == "") {
                            DisplayMassage_Processes("لا يمكن ان تكون اقل كمية اكبر من او تساوى اكبر كمية", "The lowest retail price cannot be greater than or equal to the wholesale price", MessageType.Worning);
                            Errorinput($("#MinQty" + item.ItemID + ""));
                            $("#MinQty" + item.ItemID + "").val(max - 1);
                        }
                        item.MinQty = Number(txt.value);
                    };
                    return txt;
                }
            },
            {
                title: 'اكبر كمية', name: "MaxQty", type: "number", width: "10%",
                itemTemplate: function (s, item) {
                    var txt = document.createElement("input");
                    txt.type = "input";
                    txt.id = "MaxQty" + item.ItemID;
                    txt.name = "MaxQty";
                    txt.disabled = true;
                    txt.className = "form-control input-sm classDescQTY";
                    txt.value = item.MaxQty.toString();
                    txt.setAttribute('val', item.MaxQty.toString());
                    txt.onchange = function (e) {
                        item.Statusflag = "u";
                        var min = Number($("#MinQty" + item.ItemID + "").val());
                        var max = Number($("#MaxQty" + item.ItemID + "").val());
                        if (min >= max || $("#MaxQty" + item.ItemID + "").val().trim() == "") {
                            DisplayMassage_Processes("لا يمكن ان تكون اقل كمية اكبر من او تساوى اكبر كمية", "The lowest retail price cannot be greater than or equal to the wholesale price", MessageType.Worning);
                            Errorinput($("#MinQty" + item.ItemID + ""));
                            $("#MinQty" + item.ItemID + "").val(max - 1);
                        }
                        item.MaxQty = Number(txt.value);
                    };
                    return txt;
                }
            },
            { title: 'الكمية الافتتاحية', name: "StartQty", type: "number", width: "10%" },
            { title: 'الكمية الحالية', name: "OnhandQty", type: "number", width: "10%" },
        ];
    }
    function btnUpdate3_onclick() {
        $('#btnBack_3').removeClass('display_none');
        $('#btnSave_3').removeClass('display_none');
        $('#btnUpdate3').addClass('display_none');
        $('#div_dis').addClass('disabledDiv');
        $('#id_divGridDetails').addClass('disabledDiv');
        $('#Div_Show_units').addClass('disabledDiv');
        $('.classDescQTY').removeAttr('disabled');
    }
    function btnSave_3_onclick() {
        Update3();
        DisplayQty();
    }
    function btnBack_3_onclick() {
        if (flagqty == 1) {
            if (flagqty == 1) {
                DisplayQty();
            }
            else {
                btnpriv_onclick();
            }
        }
        else {
            btnpriv_onclick();
        }
        $('.classDescQTY').attr('disabled', 'disabled');
        $('#btnBack_3').addClass('display_none');
        $('#btnSave_3').addClass('display_none');
        $('#btnUpdate3').removeClass('display_none');
        $('#id_divGridDetails').removeClass('disabledDiv');
        $('#Div_Show_units').removeClass('disabledDiv');
        $('#div_dis').removeClass('disabledDiv');
    }
    function Update3() {
        Assign3();
        Ajax.Callsync({
            type: "Post",
            url: sys.apiUrl("I_ItemStore", "Update"),
            data: JSON.stringify(ModelDetialqty),
            success: function (d) {
                var result = d;
                if (result.IsSuccess == true) {
                    var itemid = result.Response;
                    DisplayMassage_Processes('تم الحقظ بنجاح', 'saved', MessageType.Succeed);
                    $('#btnBack_3').addClass('display_none');
                    $('#btnSave_3').addClass('display_none');
                    $('#btnUpdate3').removeClass('display_none');
                    $('#div_dis').removeClass('disabledDiv');
                    $('#div_ContentData').removeClass('disabledDiv');
                    $('#id_divGridDetails').removeClass('disabledDiv');
                    $('#Div_Show_units').removeClass('disabledDiv');
                    $('.classDescQTY').attr('disabled', 'disabled');
                }
                else {
                    DisplayMassage_Processes('خطأ', 'Wrong', MessageType.Worning);
                }
            }
        });
    }
    function Assign3() {
        var data_Taple1 = DetailsQty.filter(function (x) { return x.Statusflag == "u"; });
        ModelDetialqty = new Array();
        for (var i = 0; i < data_Taple1.length; i++) {
            Modelyearqty = new I_ItemStore;
            Modelyearqty.ItemStoreID = Number(data_Taple1[i].ItemStoreID);
            Modelyearqty.ItemID = Number(data_Taple1[i].ItemID);
            Modelyearqty.FinYear = Number(data_Taple1[i].FinYear);
            Modelyearqty.StoreCode = Number(data_Taple1[i].StoreCode);
            Modelyearqty.BraCode = Number(data_Taple1[i].BraCode);
            Modelyearqty.CompCode = Number(data_Taple1[i].CompCode);
            Modelyearqty.LOCATION = data_Taple1[i].LOCATION;
            Modelyearqty.LOCATION2 = data_Taple1[i].LOCATION2;
            Modelyearqty.BookQty = Number(data_Taple1[i].BookQty);
            Modelyearqty.OnRoadQty = Number(data_Taple1[i].OnRoadQty);
            Modelyearqty.OnOrderQty = Number(data_Taple1[i].OnOrderQty);
            Modelyearqty.ReOrderQty = Number(data_Taple1[i].ReOrderQty);
            //Modelyearqty.MinQty = Number(data_Taple1[i].MinQty);
            Modelyearqty.MinQty = Number(data_Taple1[i].MaxQty);
            Modelyearqty.MaxQty = Number(data_Taple1[i].MaxQty);
            Modelyearqty.StartQty = Number(data_Taple1[i].MaxQty);
            Modelyearqty.OnhandQty = Number(data_Taple1[i].MaxQty);
            //Modelyearqty.StartQty = Number(data_Taple1[i].StartQty);
            //Modelyearqty.OnhandQty = Number(data_Taple1[i].OnhandQty); 
            Modelyearqty.StartLocalCost = Number(data_Taple1[i].StartLocalCost);
            Modelyearqty.LocalCost = Number(data_Taple1[i].LocalCost);
            Modelyearqty.CreatedAt = data_Taple1[i].CreatedAt;
            Modelyearqty.CreatedBy = data_Taple1[i].CreatedBy;
            Modelyearqty.UpdatedAt = data_Taple1[i].UpdatedAt;
            Modelyearqty.UpdatedBy = data_Taple1[i].UpdatedBy;
            Modelyearqty.StoreId = Number(data_Taple1[i].StoreId);
            ModelDetialqty.push(Modelyearqty);
        }
    }
})(StkDefItemsNew || (StkDefItemsNew = {}));
//# sourceMappingURL=StkDefItemsNew.js.map