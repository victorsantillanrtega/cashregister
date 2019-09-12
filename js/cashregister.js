/**
 * This source file is not Open Software License
 * @author Victor Santillan <santillan-15@live.com.mx>
 * @copyright Copyright (c) 2019, Victor Santillan
 */
function CashRegister() {

    var $obj = this;
    $obj.count = 0;
    $obj.total = 0;
    $obj.qtys = {};
    $obj.defaults = {
        "id": "cash_register",
        "class": "",
        "action": "",
        "method": "POST",
        "id_form": "f_cashregister",
        "cancel": "",
        "qtys": true,
        "amountName": "total_amount"
    }
}

CashRegister.prototype = {
    denominations: {
        "0.10": {
            type: "coin",
            active: 1,
            text: "diez centavos",
            currency: "10c",
            formatQty: "010",
            qty: 0
        },
        "0.20": {
            type: "coin",
            active: 1,
            text: "veinte centavos",
            currency: "20c",
            formatQty: "020",
            qty: 0
        },
        "0.50": {
            type: "coin",
            active: 1,
            text: "cincuenta centavos",
            currency: "50c",
            formatQty: "050",
            qty: 0
        },
        "1": {
            type: "coin",
            active: 1,
            text: "un peso",
            currency: "$1.00",
            formatQty: "100",
            qty: 0
        },
        "2": {
            type: "coin",
            active: 1,
            text: "dos pesos",
            currency: "$2.00",
            formatQty: "200",
            qty: 0
        },
        "5": {
            type: "coin",
            active: 1,
            text: "tres pesos",
            currency: "$5.00",
            formatQty: "500",
            qty: 0
        },
        "10": {
            type: "coin",
            active: 1,
            text: "diez pesos",
            currency: "$10.00",
            formatQty: "1000",
            qty: 0
        },
        "20": {
            type: "bill",
            active: 1,
            text: "veinte pesos",
            currency: "$20.00",
            formatQty: "2000",
            qty: 0
        },
        "50": {
            type: "bill",
            active: 1,
            text: "cincuenta pesos",
            currency: "$50.00",
            formatQty: "5000",
            qty: 0
        },
        "100": {
            type: "bill",
            active: 1,
            text: "cien pesos",
            currency: "$100.00",
            formatQty: "10000",
            qty: 0
        },
        "200": {
            type: "bill",
            active: 1,
            text: "doscientos pesos",
            currency: "$200.00",
            formatQty: "20000",
            qty: 0
        },
        "500": {
            type: "bill",
            active: 1,
            text: "quinientos pesos",
            currency: "$500.00",
            formatQty: "50000",
            qty: 0
        },
        "1000": {
            type: "bill",
            active: 1,
            text: "mil pesos",
            currency: "$1,000.00",
            formatQty: "100000",
            qty: 0
        },
        "2000": {
            type: "bill",
            active: 1,
            text: "dos mil pesos",
            currency: "$2,000.00",
            formatQty: "200000",
            qty: 0
        }
    },
    setDefaults: function(defaults) {
        this.defaults = defaults;
    },
    onkeyup: function(elem, evt) {
        if (evt.keyCode === 13 || evt.which === 13) {
            this.validateInput(elem);
            return false;
        }

        return true;
    },
    onkeypress: function(evt) {
        if (evt.keyCode === 13 || evt.which === 13) {
            evt.preventDefault();
            return false;
        }
        return true;
    },
    validateInput: function(elem) {
        var valid = true,
            parts = elem.value.split("*");

        if (parts.length <= 1) {
            valid = false;
        } else {
            var qty = parseInt(parts[0]),
                deno = parts[1];

            if (Number.isInteger(qty) == false || qty <= 0) {
                valid = false;
            }

            if (!this.denominations.hasOwnProperty(deno)) {
                valid = false;
            }
        }

        document.getElementById("amount").value = "";
        if (valid) {
            document.getElementById("txt-validate").innerHTML = "Enter...";
            document.getElementById("amount").className = "form-ctrl alert-success";
            this.addInput(qty, deno)
        } else {
            document.getElementById("txt-validate").innerHTML = "Invalido...";
            document.getElementById("amount").className = "form-ctrl alert-danger";
        }

        return true;
    },
    addInput: function(qty, deno) {
        var $obj = this,
            amount = parseFloat(qty * deno).toFixed(2);

        var tblBody = document.getElementById("tblBody-qty");

        var row = document.createElement("tr");
        row.id = "row-" + $obj.count;

        lastRow = document.getElementById("row-" + ($obj.count - 1));

        if(typeof lastRow != "undefined" && lastRow != null){
            if(lastRow.className.includes("rowa")){
                row.className = "rowb";
            }else{
                row.className = "rowa";
            }
        }else{
            row.className = "rowa";
        }

        cell1 = document.createElement("td");
        cell1.className = "tcell";
        cell1.innerHTML = qty;

        cell2 = document.createElement("td");
        cell2.className = "tcell";
        cell2.innerHTML = $obj.denominations[deno].currency;

        cell3 = document.createElement("td");
        cell3.className = "tcellTotal";
        cell3.innerHTML = "$" + $obj.numberFormat(amount);

        spanDel = document.createElement("span");
        spanDel.id = "spandel-" + $obj.count;
        spanDel.className = "spandel";
        spanDel.innerHTML = "x";
        spanDel.dataset.id = $obj.count;
        spanDel.dataset.amount = amount;
        spanDel.dataset.qty = qty;
        spanDel.dataset.deno = deno;

        spanDel.onclick = function(evt) {
            $obj.deleteInput(this);
        };

        var input = document.createElement("input");
        input.name = "amount-" + $obj.count;
        input.id = "amount-" + $obj.count;
        input.className = "amounts";
        input.type = "hidden";
        input.value = amount;

        cell1.appendChild(spanDel);
        
        if($obj.defaults.qtys){
        	$obj.qtysProcess(qty,deno,1);
        }else{
        	cell1.appendChild(input);
        }

        row.appendChild(cell1);
        row.appendChild(cell2);
        row.appendChild(cell3);

        $obj.total = parseFloat($obj.total) + parseFloat(amount);

        document.getElementById("td2-total").innerHTML = "$" + $obj.numberFormat($obj.total);
        document.getElementById($obj.defaults.amountName).value = $obj.total;
        document.getElementById("count").value = $obj.count;

        rowTotal = document.getElementById("tr-total");

        tblBody.insertBefore(row, rowTotal);
        $obj.count++;
    },
    deleteInput: function(elem) {
        $obj = this;

        var index = elem.dataset.id,
            amount = elem.dataset.amount,
            qty = elem.dataset.qty,
            deno = elem.dataset.deno;

        $obj.total = parseFloat($obj.total) - parseFloat(amount);

        var tbody = document.getElementById("tblBody-qty"),
            row = document.getElementById("row-" + index);

        tbody.removeChild(row);

        if($obj.defaults.qtys){
        	$obj.qtysProcess(qty,deno,2);
        }

        document.getElementById("td2-total").innerHTML = "$" + $obj.numberFormat($obj.total);
        document.getElementById($obj.defaults.amountName).value = $obj.total;
    },
    qtysProcess: function(qty,deno,operation){
    	$obj = this;
    	if(operation == 1){
    		$obj.denominations[deno].qty += parseInt(qty);
    	}else{
    		$obj.denominations[deno].qty -= parseInt(qty);
    	}
    },
    numberFormat: function(number) {
        number = parseFloat(number).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        return number;
    },
    validateForm: function() {
        var $obj = this,
            amount = $obj.total.toFixed(2),
            qtys = "";

        qtys += "total="+amount.replace(".","");

        for(deno in $obj.denominations){

         	if($obj.denominations[deno].qty <= 0){
         		continue;
         	}

         	qtys += "&qty_"+$obj.denominations[deno].formatQty+"="+$obj.denominations[deno].qty;
        }
        document.getElementById("qtys").value = qtys;

        if ($obj.total < 0) {
            return;
        }

        if (confirm("¿Está seguro de enviar esta cantidad $" + $obj.numberFormat(amount) + "?")) {
            document.getElementById($obj.defaults.id_form).submit();
        }

        return true;
    },
    createHTML: function() {
        var $obj = this;

        var f = document.getElementById($obj.defaults.id_form);
        
        if(typeof f ==  "undefined" || f == null){
            f = document.createElement("form");
        }
        
        f.id = $obj.defaults.id_form;
        f.name = $obj.defaults.id_form;
        f.method = $obj.defaults.method;
        f.action = $obj.defaults.action;

        var input = document.createElement("input");
        input.id = "amount";
        input.name = "amount";
        input.className = "form-ctrl";
        input.type = "text";
        input.placeholder = "cantidad*denominación";
        input.onkeyup = function(evt) {
            $obj.onkeyup(this, evt);
        };
        input.onkeypress = function(evt) {
            $obj.onkeypress(evt);
        };

        var span = document.createElement("span");
        span.id = "txt-validate"
        span.className = "txt-validate";
        span.innerHTML = "Enter...";

        var tbl = document.createElement("table");
        tbl.id = "tbl-qty";
        tbl.className = "";
        tbl.border = "1";

        var tblHead = document.createElement("thead");
        tblHead.className = "tthead";

        var tblBody = document.createElement("tbody");
        tblBody.id = "tblBody-qty";

        var row = document.createElement("tr");

        var cell1 = document.createElement("th");
        cell1.className = "tcell";
        cell1.innerHTML = "Cantidad";

        var cell2 = document.createElement("th");
        cell2.className = "tcell";
        cell2.innerHTML = "Moneda";

        var cell3 = document.createElement("th");
        cell3.className = "tcell";
        cell3.innerHTML = "Total";

        var rowTotal = document.createElement("tr");
        rowTotal.id = "tr-total";

        var cell1Total = document.createElement("td");
        cell1Total.id = "td1-total";
        cell1Total.colSpan = 2;
        cell1Total.innerHTML = "Total";

        var cell2Total = document.createElement("td");
        cell2Total.id = "td2-total";
        cell2Total.className = "tcellTotal";
        cell2Total.innerHTML = "$" + $obj.numberFormat($obj.total);

        var total = document.createElement("input");
        total.id = $obj.defaults.amountName;
        total.name = $obj.defaults.amountName;
        total.type = "hidden";
        total.value = $obj.total;

        var count = document.createElement("input");
        count.id = "count";
        count.type = "hidden";
        count.name = "count";
        count.value = $obj.count;

        var qtys = document.createElement("input");
        qtys.id = "qtys";
        qtys.name = "qtys";
        qtys.type = "hidden";
        qtys.value = "total=0";

        var br = document.createElement("br");

        var submit = document.createElement("button");
        submit.id = "btn-submit";
        submit.innerHTML = "Enviar";
        submit.className = "btn btn-primary pull-right";
        submit.type = "button";
        submit.onclick = function(evt) {
            $obj.validateForm();
        };

        if ($obj.defaults.cancel != "") {
            cancel = document.createElement("a");
            cancel.id = "btn-cancel";
            cancel.innerHTML = "Cancelar";
            cancel.href = $obj.defaults.cancel;
            cancel.className = "btn btn-warning pull-left";
        }

        row.appendChild(cell1);
        row.appendChild(cell2);
        row.appendChild(cell3);

        tblHead.appendChild(row);

        rowTotal.appendChild(cell1Total);
        rowTotal.appendChild(cell2Total);

        tblBody.appendChild(rowTotal);

        tbl.appendChild(tblHead);
        tbl.appendChild(tblBody);

        f.appendChild(total);
        f.appendChild(qtys);
        f.appendChild(count);
        f.appendChild(input);
        f.appendChild(span);
        f.appendChild(br);

        f.appendChild(tbl);
        if ($obj.defaults.cancel != "") {
            f.appendChild(cancel);
        }
        f.appendChild(submit);

        var content = document.getElementById($obj.defaults.id);

        if (typeof content != 'undefined' && content != null) {
            content.className += " "+$obj.defaults.class+" ctn-cashregister";
            content.appendChild(f);
        } else {
            var content = document.createElement("div");
            content.id = $obj.defaults.id;
            content.className = $obj.defaults.class + " ctn-cashregister";
            content.appendChild(f);
            document.getElementsByTagName("body")[0].appendChild(content);
        }
    }
};
