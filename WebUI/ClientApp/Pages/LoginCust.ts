$(document).ready(function () {
    LoginComponent.checkBrowser();
    //LoginComponent.InitalizeComponent();
});
var LoginComponent;
(function (LoginComponent) {
    var sys = new SystemTools();
    var sysPar = new SystemParameters();
    var Model_Cust: CUSTOMER = new CUSTOMER();
    var CUSTOMERdETAIL: Array <CUSTOMER >= new Array <CUSTOMER>();
    var CUSTSingl: CUSTOMER = new CUSTOMER();
    var CUSTOMERdETAILnew: Array <CUSTOMER >= new Array <CUSTOMER>();

    var cmbLanguage;
    var OnLoggedUrl = "";
    var txtUserName;
    var txtUserNameS;
    var txtNameArS;
    var txtNameEnS;
    var txtConfirmpasswordS;
    var txtAddressS;
    var btnBackS;
    var txtUserPassword;
    var txtPhoneS;
    var txtUserPasswordS: HTMLInputElement;
    var txtEmailS;
    var btnOkS;
    var chkRemember;
    var btnLogin;
    var btnSignUp;
    var btnBack;
    var txtYear;
    var hLoggedName;
    var spnLoggedYear;
    var cmbBranch;
    var cmbCompany;
    var login_;
    var vSysTimeOut = " 30";

    var compData = Array();
    var SystemEnv: SystemEnvironment = new SystemEnvironment();
    var SysSession: SystemSession = GetSystemSession();
    var G_BRANCHService: Array<G_BRANCH> = new Array<G_BRANCH>();


    function InitalizeComponent() {           
        txtUserName = document.getElementById("txtUserName");
        txtUserPassword = document.getElementById("txtUserPassword");
        txtUserNameS = document.getElementById("txtUserNameS");
        txtNameArS = document.getElementById("txtNameArS");
        txtNameEnS = document.getElementById("txtNameEnS");
        txtConfirmpasswordS = document.getElementById("txtConfirmpasswordS");
        txtUserPasswordS = document.getElementById("txtUserPasswordS") as HTMLInputElement;
        txtPhoneS = document.getElementById("txtPhoneS");
        txtEmailS = document.getElementById("txtEmailS");
        txtAddressS = document.getElementById("txtAddressS");
        btnOkS = document.getElementById("btnOkS");
        btnBackS = document.getElementById("btnBackS");
        btnLogin = document.getElementById("btnLogin");
        btnSignUp = document.getElementById("btnSignUp");
        //btnBack = document.getElementById("btnBack");
        //cmbLanguage = document.getElementById("cmbLanguage");
        //txtYear = document.getElementById("txtYear");
        //hLoggedName = DocumentActions.GetElementById("hLoggedName");
        //spnLoggedYear = DocumentActions.GetElementById("spnLoggedYear");
        //cmbCompany = document.getElementById("cmbCompany");
        //cmbBranch = document.getElementById("cmbBranch");
        OnLoggedUrl = $("#OnLogged").val();
        //btnBack.addEventListener("click", GoBack);
        btnLogin.addEventListener("click", Login);
        //MessageBox
        btnSignUp.addEventListener("click", SignUp);
        btnBackS.addEventListener("click", BackS);
        btnOkS.addEventListener("click", OkS);
        btnOkS.addEventListener("click", Registration);
        var loginData = localStorage.getItem("Inv1_Login_Data");
        if (loginData != null) {

            var data = JSON.parse(loginData);
            txtUserName.value = data.USER_CODE;
            txtUserPassword.value = data.USER_PASSWORD;

            //txtYear.value = "2021";
            //cmbLanguage.value = data.Language;
            //chkRemember.checked = true;
        }
        else {

        }
    }
    
    LoginComponent.InitalizeComponent = InitalizeComponent;
    function checkBrowser() {
        // Get the user-agent string
        var userAgentString = navigator.userAgent;
        // Detect Chrome
        var chromeAgent = userAgentString.indexOf("Chrome") > -1;
        if (userAgentString == "Mozilla/5.0 (iPad; CPU OS 11_0 like Mac OS X) AppleWebKit/604.1.34 (KHTML, like Gecko) Version/11.0 Mobile/15A5341f Safari/604.1"
            || "Mozilla/5.0 (iPhone; U; CPU iPhone OS 5_1_1 like Mac OS X; en-gb)AppleWebKit/ 534.46.0 (KHTML, like Gecko)CriOS / 19.0.1084.60 Mobile/ 9B206 Safari/ 7534.48.3"
            || "Mozilla/5.0 (iPhone; CPU iPhone OS 10_3 like Mac OS X)AppleWebKit/ 602.1.50 (KHTML, like Gecko) CriOS/ 56.0.2924.75 Mobile / 14E5239e Safari/ 602.1") {
            chromeAgent = true;
        }
        // Detect Internet Explorer
        var IExplorerAgent =
            //User - Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/ 79.0.3945.74 Safari/ 537.36 Edg/ 79.0.309.43
            userAgentString.indexOf("MSIE") > -1 ||
            userAgentString.indexOf("rv:") > -1;
        // Detect Firefox
        var firefoxAgent = userAgentString.indexOf("Firefox") > -1;
        // Detect Safari
        var safariAgent = userAgentString.indexOf("Safari") > -1;
        var EdgeAgent = userAgentString.indexOf("Edge") > -1;
        // Discard Safari since it also matches Chrome
        if ((chromeAgent) && (safariAgent))
            safariAgent = false;
        // Detect Opera
        var operaAgent = userAgentString.indexOf("OP") > -1;
        // Discard Chrome since it also matches Opera
        if ((chromeAgent) && (operaAgent))
            chromeAgent = false;
        if (safariAgent || IExplorerAgent || operaAgent || firefoxAgent || EdgeAgent) {
            var mg = "يجب الدخول من متصفح جوجل كروم" + "You must log in from Google Chrome";
            MessageBox.Show(mg, "");
        }
        else {
            InitalizeComponent();
        }
    }
    LoginComponent.checkBrowser = checkBrowser;
    function Login() {
        var userName = txtUserName.value;
        var userPassword = txtUserPassword.value;
        var user = new G_USERS();
        user.USER_CODE = userName;
        user.USER_PASSWORD = userPassword;
        txtUserName.style.borderColor = "";
        txtUserPassword.style.borderColor = "";
        SystemEnv.ScreenLanguage = 'ar';
        SystemEnv.UserCode = userName;
        var dt = new Date();
        var timenow = dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();
        localStorage.setItem("LastAccess", timenow);
        Ajax.Callsync({
            type: "GET",
            url: sys.apiUrl("G_USERS", "CUSTOMERLogin"),
            data: { UserCode: user.USER_CODE, Password: user.USER_PASSWORD },
            success: function (d) {
                var res = d;
                debugger
                if (res.IsSuccess == true) {

                    var result = res.Response as Array<CUSTOMER>;
                    if (result.length > 0) {
                        debugger
                        //SystemEnv.Token = "HGFD-T+zTLBi1GWkWA1P36uiB4UJjB5qkuYN63Fuo+WxiH/rRXEQ825IIkQ=="; 

                        //document.cookie = "Inv1_systemProperties=" + JSON.stringify(SystemEnv).toString() + ";expires=Fri, 31 Dec 2030 23:59:59 GMT;path=/";

                        //OnLogged();
                        let compCode = result[0].CompCode;
                        let BranchCode = result[0].BranchCode;

                        $.ajax({
                            type: "GET",
                            url: sys.apiUrl("I_Control", "GetAll"),
                            data: { Compcode: compCode },
                            async: false,
                            success: (d) => {
                                let res = d as BaseResponse;
                                if (res.IsSuccess) {
                                    var CompanyService = res.Response as I_Control;
                                    if (CompanyService != null) {

                                        debugger
                                        SystemEnv.I_Control = CompanyService;
                                        SystemEnv.CompCode = compCode.toString();
                                        SystemEnv.BranchCode = BranchCode.toString();
                                        SystemEnv.IsBiLingual = true;
                                        SystemEnv.Language = "ar";
                                        SystemEnv.ScreenLanguage = "ar";
                                        SystemEnv.SystemCode = 'I';
                                        SystemEnv.SubSystemCode = 'I';
                                        SystemEnv.UserCode = txtUserName.value;
                                        SystemEnv.NationalityID = CompanyService[0].NationalityID;
                                        SystemEnv.CurrentYear = '2021';
                                        SystemEnv.CustomerId = result[0].CUSTOMER_ID;
                                        SystemEnv.CustomerCode = result[0].CustomerCODE;
                                        SystemEnv.CustomerPhone = result[0].PHONE;
                                        SystemEnv.Debit = result[0].Debit;
                                        SystemEnv.CUSTOMER_ADDRES = result[0].CUSTOMER_ADDRES;
                                        SystemEnv.CUSTOMER_NAME = result[0].CUSTOMER_NAME;


                                        $.ajax({
                                            type: "GET",
                                            url: sys.apiUrl("GBranch", "GetBranch"),
                                            data: { CompCode: Number(compCode), BRA_CODE: Number(BranchCode) },
                                            async: true,
                                            success: (d) => {
                                                let res = d as BaseResponse;
                                                if (res.IsSuccess) {
                                                    G_BRANCHService = res.Response as Array<G_BRANCH>;
                                                    if (G_BRANCHService != null) {





                                                        //SystemEnv.NationalityID = G_BRANCHService[0].NationalityID;

                                                        SystemEnv.SlsInvType = G_BRANCHService[0].SlsInvType;
                                                        SystemEnv.WholeInvoiceTransCode = G_BRANCHService[0].WholeInvoiceTransCode;
                                                        SystemEnv.RetailInvoicePayment = G_BRANCHService[0].RetailInvoicePayment;
                                                        SystemEnv.WholeInvoicePayment = G_BRANCHService[0].WholeInvoicePayment;
                                                        SystemEnv.ServiceInvoiceTransCode = G_BRANCHService[0].ServiceInvoiceTransCode;
                                                        SystemEnv.ReturnTypeCode = G_BRANCHService[0].ReturnTypeCode;
                                                        SystemEnv.InvoiceTypeCode = G_BRANCHService[0].InvoiceTypeCode;
                                                        SystemEnv.RetailInvoiceTransCode = G_BRANCHService[0].RetailInvoiceTransCode;


                                                    } else {
                                                        var msg = SystemEnv.ScreenLanguage == "ar" ? "غير مصرح لك الدخول الفرع" : "You are not allowed to login";
                                                        MessageBox.Show(msg, "");
                                                    }
                                                }
                                            }
                                        });




                                        document.cookie = "Inv1_systemProperties=" + JSON.stringify(SystemEnv).toString() + ";expires=Fri, 31 Dec 2030 23:59:59 GMT;path=/";
                                        OnLogged();
                                    } else {
                                        var msg = SystemEnv.ScreenLanguage == "ar" ? "غير مصرح لك الدخول للنظام" : "You are not allowed to login";
                                        MessageBox.Show(msg, "");

                                    }
                                }
                            }
                        });


                    }
                    else {  // Error in user or pass or active 
                        Errorinput(txtUserName);
                        Errorinput(txtUserPassword);
                    }
                }
                else { // Error in API 
                    alert(res.ErrorMessage);
                    return;
                }
            }
        });
    }
    function getcustomer() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("Customer", "GetAll"),
            data: { CompCode:1, BranchCode:1},
            success: (d) => {
                debugger
                let result = d as BaseResponse;
                if (result.IsSuccess == true) {
                    CUSTOMERdETAIL = result.Response as Array<CUSTOMER>;

                }
                else {

                    MessageBox.Show(result.ErrorMessage, "خطأ");
                }
            }
        });
    }
    function SignUp() {
        $('#tblSignUp').removeAttr('Style');
        $('#tblLogin').attr('Style', 'display:none');
        getcustomer();
        ClearInputs();    
    }
    function OkS() {
        if (txtNameArS.value == "") {
            Errorinput(txtNameArS);
            DisplayMassage("يجب ادخال الاسم بالعربي", "The delegate number must be entered", MessageType.Worning);
        } else {
            if (txtNameEnS.value == "") {
                Errorinput(txtNameEnS);
                txtNameEnS.value = txtNameArS.value;
            } else {

                if (txtPhoneS.value == "") {
                    Errorinput(txtPhoneS);
                    DisplayMassage("يجب ادخال الهاتف  ", "The Phone number must be entered", MessageType.Worning);
                }
                else {
                    if (txtEmailS.value == "") {
                        Errorinput(txtEmailS);
                        DisplayMassage("يجب ادخال البريد الالكتروني  ", "The Email must be entered", MessageType.Worning);
                    } else {
                        if (txtAddressS.value == "") {
                            Errorinput(txtAddressS);
                            DisplayMassage("يجب ادخال العنوان    ", "The Address must be entered", MessageType.Worning);
                        } else {

                            if (txtUserNameS.value == "") {
                                Errorinput(txtUserNameS);
                                DisplayMassage("يجب ادخال اسم المستخدم", "Username must be entered", MessageType.Worning);
                            } else {
                                if (txtUserPasswordS.value == "") {
                                    Errorinput(txtUserPasswordS);
                                    DisplayMassage("يجب ادخال كلمة السر", "Password must be entered", MessageType.Worning);
                                } else {
                                    if (txtUserPasswordS.value.length < 5) {
                                        Errorinput(txtUserPasswordS);
                                        DisplayMassage("  يجب الا تقل كلمة السر عن 5 ارقام", "Password must be entered", MessageType.Worning);                     
                                    }
                                    else {

                                        if (txtConfirmpasswordS.value == "") {
                                            Errorinput(txtConfirmpasswordS);
                                            DisplayMassage("يجب ادخال تاكيد كلمة السر", "Confirm password must be entered", MessageType.Worning);
                                        } else {
                                            debugger
                                            if (txtUserPasswordS.value != txtConfirmpasswordS.value) {
                                                Errorinput(txtUserPasswordS);
                                                Errorinput(txtConfirmpasswordS);
                                                DisplayMassage("كلمتا المرور غير متطابقتان", "Passwords do not match", MessageType.Worning);
                                            } else {
                                                CUSTOMERdETAILnew = CUSTOMERdETAIL.filter(x => x.CustomerCODE == txtUserPasswordS.value)
                                                if (CUSTOMERdETAILnew.length > 0) {
                                                    Errorinput(txtUserPasswordS);
                                                    DisplayMassage("كلمة السر ضعيفة", "Password must be entered", MessageType.Worning);
                                                } else {

                                                    successSignUp();
                                                }
                                            }
                                        }
                                    }
                                }
                            }

                        }

                    }
                }
            }
        }


    }
    function successSignUp() {

        Model_Cust = new CUSTOMER();
        Model_Cust.CUSTOMER_ID = 0;
        Model_Cust.CompCode = 1;
        Model_Cust.BranchCode = 1;
        Model_Cust.CUSTOMER_ADDRES_2 = txtUserNameS.value;
        Model_Cust.CustomerCODE = txtUserPasswordS.value;
        Model_Cust.CUSTOMER_NAME = txtNameArS.value;
        Model_Cust.NAMEE = txtNameEnS.value;
        Model_Cust.CUSTOMER_ADDRES = txtAddressS.value;
        Model_Cust.PHONE = txtPhoneS.value;
        Model_Cust.EMAIL = txtEmailS.value;

        Ajax.Callsync({
            type: "POST",
            url: sys.apiUrl("Customer", "Insertcustomer"),
            data: JSON.stringify(Model_Cust),
            success: (d) => {
                debugger
                let result = d as BaseResponse;
                if (result.IsSuccess == true) {
                    debugger
                    CUSTSingl = result.Response as CUSTOMER;
                    txtUserName.value = CUSTSingl.CUSTOMER_ADDRES_2;
                    txtUserPassword.value = CUSTSingl.CustomerCODE;
                    Login();
                }
                else {

                    MessageBox.Show(result.ErrorMessage, "خطأ");
                }
            }
        });
    }
    function BackS() {
        $('#tblLogin').removeAttr('Style');
        $('#tblSignUp').attr('Style', 'display:none');
        ClearInputs();
    }
    function ClearInputs() {
        txtNameArS.value = "";
        txtNameEnS.value = "";
        txtPhoneS.value = "";
        txtAddressS.value = "";
        txtEmailS.value = "";
        txtUserNameS.value = "";
        txtUserPasswordS.value = "";
        txtConfirmpasswordS.value = "";
    }
         
    function Registration() {

    }
    function OnLogged() {

        // set api session values 
        APiSession.Session.BranchCode = SystemEnv.BranchCode;
        APiSession.Session.CompCode = SystemEnv.CompCode;
        APiSession.Session.SystemCode = SystemEnv.SystemCode;
        APiSession.Session.SubSystemCode = SystemEnv.SubSystemCode;
        APiSession.Session.ScreenLanguage = SystemEnv.ScreenLanguage;
        APiSession.Session.UserCode = SystemEnv.UserCode;
        $.ajax({
            url: OnLoggedUrl,
            success: function (result) {

                var obj = result.result;
                window.location.href = obj.url;
            }
        });

    }
    function GoBack() {
        $("#divCompanies").addClass("display_none");
        $("#div_pass").addClass("display_none");

    }
    function Gologin() {
        $("#div_pass").removeClass("display_none");

        $("#btn_login_1").addClass("display_none");
        $("#btn_login_2").removeClass("display_none");


    }
    function cmbCompany_Onchange(compCode, lang) {
        Ajax.Callsync({
            type: "GET",
            url: sys.apiUrl("SystemTools", "GetBranchsUser"),
            data: { compCode: compCode, userCode: txtUserName.value },
            success: function (d) {
                var res = d;
                if (res.IsSuccess == true) {
                    var result = res.Response;
                    cmbBranch.innerHTML = "";
                    result.forEach(function (bra, index) {
                        var text = bra.BRA_CODE.toString() + "- " + (lang == "en" ? bra.BRA_DESCE : bra.BRA_DESC);
                        cmbBranch.add(new Option(text, bra.BRA_CODE.toString()));
                    });
                }
            }
        });
    }
})(LoginComponent || (LoginComponent = {}));
//# sourceMappingURL=LoginComponent.js.map