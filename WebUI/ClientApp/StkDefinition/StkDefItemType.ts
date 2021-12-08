
$(document).ready(() => {
    StkDefItemType.InitalizeComponent();
})

namespace StkDefItemType {

    var AccountType: Number = 1;
    var MSG_ID: number;
    var Details: Array<I_ItemFamily> = new Array<I_ItemFamily>();
    var Display_Type: Array<I_D_Category> = new Array<I_D_Category>();
    var Details_New: Array<I_ItemFamily> = new Array<I_ItemFamily>();

    var BilldDetail = new Array<I_ItemFamily>();
    var Detail_Model = new Array<I_ItemFamily>();

    //var Details: Array<I_D_Category> = new Array<I_D_Category>();
    var btnNew_sub_Add_service: HTMLButtonElement;
    var btnsave: HTMLButtonElement;
    var btnAddDetails: HTMLButtonElement;
    var btnEdit: HTMLButtonElement;
    var sys: SystemTools = new SystemTools();
    //var sys: _shared = new _shared();
    var SysSession: SystemSession = GetSystemSession();
    var Model: I_ItemFamily = new I_ItemFamily();

    var CountGrid = 0;
    var compcode: Number;//SharedSession.CurrentEnvironment.CompCode;
    var btnback: HTMLButtonElement;

    var catId;
    var catId_type_change;
    var lang = (SysSession.CurrentEnvironment.ScreenLanguage);




    export function InitalizeComponent() {
        ////debugger;

        if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
            document.getElementById('Screen_name').innerHTML = "أنواع الأصناف";

        } else {
            document.getElementById('Screen_name').innerHTML = "ItemType";

        }

        compcode = Number(SysSession.CurrentEnvironment.CompCode);
        InitalizeControls();
        InitalizeEvents();

        Display_DrpPaymentType();
        //Display();
    }

    $('#btnedite').on('click', function () {

        if (SysSession.CurrentPrivileges.EDIT) {
            $('#btnsave').toggleClass("display_none");
            $('#btnback').toggleClass("display_none");
            $("#div_ContentData :input").removeAttr("disabled");
            $("#btnedite").toggleClass("display_none");
        }
        else {
            $('#btnsave').toggleClass("display_none");
            $('#btnback').toggleClass("display_none");

            $("#btnedite").toggleClass("display_none");

        }
        if (SysSession.CurrentPrivileges.AddNew) {
            $(".btnAddDetails").removeAttr("disabled");
            $('#btnAddDetails').attr('class', 'glyphicon glyphicon-plus-sign')
        }
        else {
            $(".btnAddDetails").attr("disabled", "disabled");

        }
        if (SysSession.CurrentPrivileges.Remove) {
            //debugger;
            $(".fa-minus-circle").removeClass("display_none");

        }
        else {

            $(".fa-minus-circle").addClass("display_none");

        }

    });

    function InitalizeControls() {
        ////debugger;
        btnAddDetails = document.getElementById("btnAddDetails") as HTMLButtonElement;
        btnEdit = document.getElementById("btnedite") as HTMLButtonElement;
        btnsave = document.getElementById("btnsave") as HTMLButtonElement;
        btnback = document.getElementById("btnback") as HTMLButtonElement;

        // Buton privialges for single record page



    }

    function InitalizeEvents() {
        ////debugger;
        btnAddDetails.onclick = AddNewRow;//
        btnsave.onclick = btnsave_onClick;
        btnback.onclick = btnback_onclick;
        $("#drpPaymentType").on('change', function () {







          

            catId = $('#drpPaymentType').val();


            btnback_onclick();
          


            //debugger;




        });
    }

    function AddNewRow() {
        ////debugger
        if (!SysSession.CurrentPrivileges.AddNew) return;
        var CanAdd: boolean = true;
        if (CountGrid > 0) {
            for (var i = 0; i < CountGrid; i++) {
                debugger
                CanAdd = Validation_Grid(i);
                if (CanAdd == false) {
                    break;
                }
            }
        }
        if (CanAdd) {
            BuildControls(CountGrid);
            $("#txt_StatusFlag" + CountGrid).val("i"); //In Insert mode

            $("#txtCode" + CountGrid).removeAttr("disabled");
            $("#txtDescA" + CountGrid).removeAttr("disabled");
            $("#txtDescL" + CountGrid).removeAttr("disabled");
            $("#select_Type_Item" + CountGrid).removeAttr("disabled");
            $("#select_Type_Item" + CountGrid).removeAttr("disabled");
            $("#txtRefItemCode" + CountGrid).removeAttr("disabled");
            $("#txtBarCodePrefix" + CountGrid).removeAttr("disabled");
            $("#txtLastBarCodeSeq" + CountGrid).removeAttr("disabled");
            //$("#txtAcount_Code" + CountGrid).removeAttr("disabled");

            // can delete new inserted record  without need for delete privilage
            $("#btn_minus" + CountGrid).removeClass("display_none");
            $("#btn_minus" + CountGrid).removeAttr("disabled");

            //$(".minus_btn").addClass("display_none");
            $("#btnedite").removeClass("display_none");

            CountGrid++;
            //$('#select_Type_Item' + CountGrid).prop("value", catId);
        }

        $("#btnedite").addClass("display_none");

    }
     
    function BuildControls(cnt: number) {
        var html;
   
        html = '  <div id="No_Row' + cnt + '" class="container-fluid  ">' +
            
            '<div class="col-lg-12">' +
            '<span id="btn_minus' + cnt + '" class="fa fa-minus-circle fontitm3 display_none"></span>' +

            '<div class="col-lg-1 pad_"><input disabled id="txtCode' + cnt + '" type="text" class="form-control right2"></div>' +
            '<div class="col-lg-3 pad_"><input disabled id="txtDescA' + cnt + '" type="text" class="form-control right2"></div>' +
            '<div class="col-lg-3 pad_"><input disabled id="txtDescL' + cnt + '" type="text" class="form-control right2"></div>' +
            '<div class="col-lg-1 pad_"><select disabled id="select_Type_Item' + cnt + '" class="form-control"> <option value="Null"> ' + (lang == "ar" ? "اختر الفئة" : " Type_Item ") + '</option></select></div>' +
            '<div class="col-lg-2 pad_"><input disabled id="txtRefItemCode' + cnt + '" type="number" class="form-control right2"></div>' +
            '<div class="col-lg-1 pad_"><input disabled id="txtBarCodePrefix' + cnt + '" type="text" class="form-control right2"></div>' +
            '<div class="col-lg-1 pad_"><input disabled id="txtLastBarCodeSeq' + cnt + '" type="number" class="form-control right2"></div>' +
            '</div>' +
        '</div>' +
            '<input id="txt_StatusFlag' + cnt + '" name = " " type = "hidden" class="form-control"/><input id="txt_ID' + cnt + '" name = " " type = "hidden" class="form-control" />';
        $("#div_Data").append(html);

        for (var i = 0; i < Display_Type.length; i++) {
            //debugger;


            $('#select_Type_Item' + cnt).append('<option value="' + Display_Type[i].CatID + '">' + (lang == "ar" ? Display_Type[i].DescA : Display_Type[i].DescL) + '</option>');


        }


        $("#btn_minus" + cnt).on('click', function () {
            DeleteRow(cnt);
        });
        $("#txtCode" + cnt).on('change', function () {
            Validate_code(cnt);
        });
        $("#txtDescA" + cnt).on('change', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
        });
        $("#txtDescL" + cnt).on('change', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
        });
        $("#txtRefItemCode" + cnt).on('change', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
        });
        $("#txtBarCodePrefix" + cnt).on('change', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
        });
        $("#txtLastBarCodeSeq" + cnt).on('change', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
        });

        $("#select_Type_Item" + cnt).on('change', function () {

            catId_type_change = $('#drpPaymentType').val();

            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
        });

        if (SysSession.CurrentPrivileges.Remove) {
            //$("#btn_minus" + cnt).removeClass("display_none");
            //$("#btn_minus" + cnt).removeAttr("disabled");

            $("#btn_minus" + cnt).addClass("display_none");
            $("#btn_minus" + cnt).attr("disabled", "disabled");
        }
        else {
            $("#btn_minus" + cnt).addClass("display_none");
            $("#btn_minus" + cnt).attr("disabled", "disabled");
        }





        return;
    }

    function btnsave_onClick() {
        var CanAdd: boolean = true;
        if (CountGrid > 0) {
            for (var i = 0; i < CountGrid; i++) {
                debugger
                CanAdd = Validation_Grid(i);
                if (CanAdd == false) {
                    break;
                }
            }
        }
        if (CanAdd) {
            Update();
        }
    }
     
    function Display_DrpPaymentType() {
        //var StkDefCategory: Array<I_D_Category> = new Array<I_D_Category>();
        //debugger; 
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("StkDefCategory", "GetAll"),
            data: {
                CompCode: compcode, UserCode: SysSession.CurrentEnvironment.UserCode, Token: "HGFD-" + SysSession.CurrentEnvironment.Token
            },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    Display_Type = result.Response as Array<I_D_Category>;

                    DisplayStkDefCategory();
                }
            }
        });
    }

    function DisplayStkDefCategory() {
        for (var i = 0; i < Display_Type.length; i++) {
            //debugger; 


            $('#drpPaymentType').append('<option value="' + Display_Type[i].CatID + '">' + (lang == "ar" ? Display_Type[i].DescA : Display_Type[i].DescL) + '</option>');


        }

    }

    function refresh() {

        $('#div_Data').html("");

        CountGrid = 0;

        catId = $('#drpPaymentType').val();

        Display();

    }

    function Update() {
        Assign();
        //debugger;
       
        Detail_Model[0].Token = "HGFD-" + SysSession.CurrentEnvironment.Token;
        Detail_Model[0].UserCode = SysSession.CurrentEnvironment.UserCode;


        //debugger;
        Ajax.Callsync({

            type: "POST",
            url: sys.apiUrl("StkDefItemType", "Updatelist"),
            data: JSON.stringify(Detail_Model),
            success: (d) => {
                //debugger
                let result = d as BaseResponse;
                if (result.IsSuccess == true) {
                    if (SysSession.CurrentEnvironment.ScreenLanguage == "ar") {
                        MessageBox.Show("تم الحفظ", "");
                    } else {
                        MessageBox.Show("Done", "");
                    }
                    btnback_onclick();

                    refresh();

                }
                else {
                    //debugger;
                    MessageBox.Show(result.ErrorMessage, "خطأ");
                }
            }
        });
    }

    function Assign() {
        Detail_Model = new Array<I_ItemFamily>();
        var StatusFlag: String;
        for (var i = 0; i < CountGrid; i++) {
            Model = new I_ItemFamily();


            StatusFlag = $("#txt_StatusFlag" + i).val();
          


            //debugger;


            if (StatusFlag == "i") {
                Model.StatusFlag = StatusFlag.toString();

                Model.CompCode = Number(SysSession.CurrentEnvironment.CompCode);
                //Model.AccountType = Number(AccountType);
                Model.CreatedBy = SysSession.CurrentEnvironment.UserCode;
                //Model.UpdatedBy = "";

                Model.ItemFamilyID = 0;
                Model.FamilyCode = $("#txtCode" + i).val();
                Model.CatID = $('#select_Type_Item' + i).val();
                Model.RefItemCode = $("#txtRefItemCode" + i).val();
                Model.BarCodePrefix = $("#txtBarCodePrefix" + i).val();
                Model.LastBarCodeSeq = $("#txtLastBarCodeSeq" + i).val();

                if ($("#txtDescA" + i).val() == "") {
                    Model.DescA = $("#txtDescL" + i).val();
                    $("#txtDescA" + i).val($("#txtDescL" + i).val());
                }
                else {
                    Model.DescA = $("#txtDescA" + i).val();
                }
                if ($("#txtDescL" + i).val() == "") {
                    Model.DescL = $("#txtDescA" + i).val();
                    $("#txtDescL" + i).val($("#txtDescA" + i).val());
                }
                else {
                    Model.DescL = $("#txtDescL" + i).val();
                }


                Detail_Model.push(Model);




                //Model.CompCode = Number(compcode);
            }
            if (StatusFlag == "u") {


                var UpdatedDetail = BilldDetail.filter(x => x.ItemFamilyID == $("#txt_ID" + i).val())
                UpdatedDetail[0].UpdatedBy = SysSession.CurrentEnvironment.UserCode;
                UpdatedDetail[0].StatusFlag = StatusFlag.toString();
                UpdatedDetail[0].FamilyCode = $("#txtCode" + i).val();
                UpdatedDetail[0].CatID = $('#select_Type_Item' + i).val();
                UpdatedDetail[0].RefItemCode = $("#txtRefItemCode" + i).val();
                UpdatedDetail[0].BarCodePrefix = $("#txtBarCodePrefix" + i).val();
                UpdatedDetail[0].LastBarCodeSeq = $("#txtLastBarCodeSeq" + i).val();

                if ($("#txtDescA" + i).val() == "") {
                    UpdatedDetail[0].DescA = $("#txtDescL" + i).val();
                    $("#txtDescA" + i).val($("#txtDescL" + i).val());
                }
                else {
                    UpdatedDetail[0].DescA = $("#txtDescA" + i).val();
                }
                if ($("#txtDescL" + i).val() == "") {
                    UpdatedDetail[0].DescL = $("#txtDescA" + i).val();
                    $("#txtDescL" + i).val($("#txtDescA" + i).val());
                }
                else {
                    UpdatedDetail[0].DescL = $("#txtDescL" + i).val();
                }



                Detail_Model.push(UpdatedDetail[0]);

            }
            if (StatusFlag == "d") {

                if ($("#txt_ID" + i).val() != "") {
                    var UpdatedDetail = BilldDetail.filter(x => x.ItemFamilyID == $("#txt_ID" + i).val())
                    UpdatedDetail[0].StatusFlag = StatusFlag.toString();
                    Detail_Model.push(UpdatedDetail[0]);
                }

            }


        }
    }

    function Display() {

        debugger
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("StkDefItemType", "GetAllNew"),
            data: { CompCode: compcode  },
            success: (d) => {
     
                debugger
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    debugger
                    Details = result.Response as Array<I_ItemFamily>;

                    DisplayGenDefCategory();
                }
            }
        });
    }

    function DisplayGenDefCategory() {

                           debugger
        CountGrid = 0;


        BilldDetail = Details.filter(x => x.CatID == catId)

        for (var i = 0; i < BilldDetail.length; i++) {

            BuildControls(CountGrid);
            CountGrid++;
            //debugger

            $("#txt_ID" + i).val(BilldDetail[i].ItemFamilyID);
            $("#txtCode" + i).val(BilldDetail[i].FamilyCode);
            $("#txtDescA" + i).val(BilldDetail[i].DescA);
            $("#txtDescL" + i).val(BilldDetail[i].DescL);
            $("#txtRefItemCode" + i).val(BilldDetail[i].RefItemCode);
            $("#txtBarCodePrefix" + i).val(BilldDetail[i].BarCodePrefix);
            $("#txtLastBarCodeSeq" + i).val(BilldDetail[i].LastBarCodeSeq);

            //for (var s = 0; s < Display_Type.length; s++) {
            //    //debugger;


            //    $('#select_Type_Item' + i).append('<option value="' + Display_Type[s].CatID + '">' + Display_Type[s].DescA + '</option>');


            //}

            $("#txt_StatusFlag" + i).val("");


            $('#select_Type_Item' + i).prop("value", catId);
            



        }






    }

    function DeleteRow(RecNo: number) {

        if (!SysSession.CurrentPrivileges.Remove) return;
        WorningMessage("هل تريد الحذف؟", "Do you want to delete?", "تحذير", "worning", () => { 
            $("#No_Row" + RecNo).attr("hidden", "true");            
            $("#txtCode" + RecNo).val("000");            
            $("#txtDescA" + RecNo).val("0");
            $("#txtDescL" + RecNo).val(0);
            $('#select_Type_Item' + RecNo).prop("selectedIndex", 1);            
            $("#txt_StatusFlag" + RecNo).val() == 'i' ? $("#txt_StatusFlag" + RecNo).val('m') : $("#txt_StatusFlag" + RecNo).val('d');
            

        });
    }

    function btnback_onclick() {
        

        if ($('#btnback').attr('class') != "btn btn-warning display_none") {
            $('#btnback').toggleClass("display_none");
        }
        if ($('#btnsave').attr('class') != "btn btn-success display_none") {
            $('#btnsave').toggleClass("display_none");
        }
        //if ($('#btnAddDetails').attr('class') != "glyphicon glyphicon-plus-sign  display_none") {
        //    $('#btnAddDetails').toggleClass("display_none");
        //}
        $('#btnAddDetails').attr('class', 'glyphicon glyphicon-plus-sign  display_none')
        $("#div_ContentData :input").attr("disabled", "true");
        $(".fa-minus-circle").addClass("display_none");
        $("#btnedite").removeClass("display_none");
        $("#btnedite").removeAttr("disabled");
        $("#drpPaymentType").removeAttr("disabled");

        CountGrid = 0;
        $("#div_Data").html("");
        Display();

    }

    function Validation_Grid(rowcount: number) {


        if ($("#txt_StatusFlag" + rowcount).val() == "d" || $("#txt_StatusFlag" + rowcount).val() == "m") {
            return true;
        }
        else {

            if ($("#txtDescA" + rowcount).val() == "") {
                $("#txtDescA" + rowcount).val($("#txtDescL" + rowcount).val());
            }
            if ($("#txtDescL" + rowcount).val() == "") {
                $("#txtDescL" + rowcount).val($("#txtDescA" + rowcount).val());
            }

            if ($("#txtCode" + rowcount).val() == '') {

                WorningMessage('ادخل كود', 'Enter The code', 'خطاء', 'Erorr');
                Errorinput($("#txtCode" + rowcount));
                return false;

            }
            if ((lang == "ar" ? $("#txtDescA" + rowcount).val() : $("#txtDescL" + rowcount).val()) == '') {

                WorningMessage('ادخل الوصف ', 'Enter The Description', 'خطاء', 'Erorr');
                Errorinput((lang == "ar" ? $("#txtDescA" + rowcount) : $("#txtDescL" + rowcount)));
                return false;

            }

            if ($("#select_Type_Item" + rowcount).val() == "Null") {
                WorningMessage('اختار الفئة', 'Enter The Type Item', 'خطاء', 'Erorr');
                Errorinput($("#select_Type_Item" + rowcount));
                return false;

            }
        }
        return true;
    }

    function Validate_code(rowno: number) {
        //debugger
        for (var i = 0; i < CountGrid; i++) {
            if (i != rowno) {

                if ($("#txt_StatusFlag" + i).val() == "d") {
                    return true;

                }
                else {

                    if ($("#txtCode" + rowno).val() == $("#txtCode" + i).val()) {
                        let Code = $("#txtCode" + rowno).val();
                        $("#txtCode" + rowno).val("");
                        WorningMessage("لا يمكن تكرار رقم الكود " + Code, "code cannot br repeated?", "تحذير", "worning", () => {
                            $("#txtCode" + rowno).val("");
                            return false;
                        });
                    }
                        
                }
            }
        }
        if ($("#txt_StatusFlag" + rowno).val() != "i") $("#txt_StatusFlag" + rowno).val("u");
        return true;
    }


}












