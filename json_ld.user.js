//==UserScript==
// @name         JSON-ld Notification
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Watch for json-ld tags and notify you on types you have specified
// @author       You
// @match        *://*/*
// @match        about:blank
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_registerMenuCommand
// @grant       GM_openInTab
// @
// ==/UserScript==


(function(){
    d = document;
    xPathRes = d.evaluate('//script[@type="application/ld+json"]/text()', d, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    var schema_org_ui={
        e:null,
       //EXAMPLE FOR WATCHING TYPES:
        watch_type:["LandmarksOrHistoricalBuildings","Organization"],
        message:function(txt)
        {
            if(this.e==null)
            {
                this.e = document.createElement('div');

            }
            this.e.innerHTML +='<div style="position:absolute;right:15px;top:15px;width:250px;height:auto;padding:10px;background-color:Red;color:white;">'+txt+'</div>';
            while(this.e.firstChild) {
                document.body.appendChild(this.e.firstChild);
            }

        },
        notification:function(elem)
        {
            console.log(elem);
            //HERE YOU CAN IMPLEMENT YOUR CHECK WHETHER YOU WANT TO THROW A MESSAGE
            if(this.watch_type==[] || (elem.hasOwnProperty('@type')  && this.watch_type.indexOf(elem['@type'])>-1))
            {
                return "<b>" + i + "</b>:<b>" +elem['@type'] +" "+elem['name'] +"</b><br />";
            }
        }

    };
    if(xPathRes.snapshotLength > 0)

    {
        var message="";

        message += xPathRes.snapshotLength + " schema.org section found.<br />";
        for (var i = 0; i < xPathRes.snapshotLength; i++) {
            var actualSpan = xPathRes.snapshotItem (i);

            actualSpan = actualSpan.textContent;
            //            console.log(actualSpan);
            if(typeof actualSpan !== "undefined")
            {
                try {
                    var obj=JSON.parse(actualSpan);

                    //console.log(obj);
                    if(obj instanceof Array)
                    {
                        //console.log("Multiple objects");
                        for (var n = 0; n < obj.length; n++) {
                            message += schema_org_ui.notification(obj[n]);
                        }
                    }
                    else if( obj=="object")
                    {
                        //console.log("Single objects");
                        message += schema_org_ui.notification(obj);
                    }
                    else
                    {
                        message += "<b>" + i + "</b>:<b>" + obj.innerHTML + "</b><br />";
                    }
                }
                catch(e)
                {
                    message += "Error parsing schema<br />";
                }
            }
            else
            {
                // console.log(actualSpan);
            }
        }

        schema_org_ui.message(message);
    }
})();