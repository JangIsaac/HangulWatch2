var SAAgent,
    SASocket,
    strAmpm = document.getElementById("str-ampm"),
    connectionListener,
    topText = "오늘 하루도",
    bottomText = "고생많았어";


/* Make Provider application running in background */
tizen.application.getCurrentApplication().hide();

function createHTML(log_string)
{
	console.log(log_string);
}

function setMsg(top, bottom)
{
	var strTop = document.getElementById("str-topmessage"),
    	strBottom = document.getElementById("str-bottommessage");
	
    strTop.innerHTML = top;
    strBottom.innerHTML = bottom;
}

connectionListener = {
    /* Remote peer agent (Consumer) requests a service (Provider) connection */
    onrequest: function (peerAgent) {

        createHTML("peerAgent: peerAgent.appName<br />" +
                    "is requsting Service conncetion...");

        /* Check connecting peer by appName*/
        if (peerAgent.appName === "HelloHangulWatch") {
            SAAgent.acceptServiceConnectionRequest(peerAgent);
            createHTML("Service connection request accepted.");
            
            tizen.application.launch("fTSIE7TZa9.HangulWatch4",null,null);

        } else {
            SAAgent.rejectServiceConnectionRequest(peerAgent);
            createHTML("Service connection request rejected.");

        }
    },

    /* Connection between Provider and Consumer is established */
    onconnect: function (socket) {
        var onConnectionLost,
            dataOnReceive;

        strAmpm.style.color = "#90ee90";

        /* Obtaining socket */
        SASocket = socket;

        onConnectionLost = function onConnectionLost (reason) {
            strAmpm.style.color = "#ffffff";
        };

        /* Inform when connection would get lost */
        SASocket.setSocketStatusListener(onConnectionLost);

        dataOnReceive =  function dataOnReceive (channelId, data) {
            var newData,
            	dataArray;

            if (!SAAgent.channelIds[0]) {
                return;
            }
            try
            {
                dataArray = data.split('-');
                topText = dataArray[0];
                bottomText = dataArray[1];
                setMsg(dataArray[0],dataArray[1]);
            }
            catch (e) {
			}
            
            newData = data + " :: " + new Date();

            /* Send new data to Consumer */
            SASocket.sendData(SAAgent.channelIds[0], newData);
        };

        /* Set listener for incoming data from Consumer */
        SASocket.setDataReceiveListener(dataOnReceive);
    },
    onerror: function (errorCode) {
        createHTML("Service connection error<br />errorCode: " + errorCode);
    }
};

function requestOnSuccess (agents) {
    var i = 0;

    for (i; i < agents.length; i += 1) {
        if (agents[i].role === "PROVIDER") {
            createHTML("Service Provider found!<br />" +
                        "Name: " +  agents[i].name);
            SAAgent = agents[i];
            break;
        }
    }

    /* Set listener for upcoming connection from Consumer */
    SAAgent.setServiceConnectionListener(connectionListener);
};

function requestOnError (e) {
    createHTML("requestSAAgent Error" +
                "Error name : " + e.name + "<br />" +
                "Error message : " + e.message);
};

/* Requests the SAAgent specified in the Accessory Service Profile */
webapis.sa.requestSAAgent(requestOnSuccess, requestOnError);


(function() {
    var timerUpdateDate = 0,
        flagDigital = false,
        battery = navigator.battery || navigator.webkitBattery || navigator.mozBattery,
        interval,
        BACKGROUND_URL = "url('./images/bg.png')",
        arrMonth = ["일월", "이월", "삼월", "사월", "오월", "유월", "칠월", "팔월", "구월", "시월", "십일월", "십이월"],
    	arrDayOfWeek = [ "일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일" ];
        
    function settingSecond(second) {
		var strTicspace = document.getElementById("str-ticspace"), 
			hanSecond = "";
		
		if (second == 0)
		{
			strTicspace.innerHTML = "";
		}
		else 
		{
			if (second > 9) {
				if (second > 19) {
					if (second > 29) {
						if (second > 39) {
							if (second > 49) {
								hanSecond = "오";
								second = second - 50;
							} else {
								hanSecond = "사";
								second = second - 40;
							}
						} else {
							hanSecond = "삼";
							second = second - 30;
						}
					} else {
						hanSecond = "이";
						second = second - 20;
					}
				} else {
					second = second - 10;
				}
				hanSecond = hanSecond + "십";
			}
			switch (second) {
			case 1:
				hanSecond = hanSecond + "&nbsp일";
				break;
			case 2:
				hanSecond = hanSecond + "&nbsp이";
				break;
			case 3:
				hanSecond = hanSecond + "&nbsp삼";
				break;
			case 4:
				hanSecond = hanSecond + "&nbsp사";
				break;
			case 5:
				hanSecond = hanSecond + "&nbsp오";
				break;
			case 6:
				hanSecond = hanSecond + "&nbsp육";
				break;
			case 7:
				hanSecond = hanSecond + "&nbsp칠";
				break;
			case 8:
				hanSecond = hanSecond + "&nbsp팔";
				break;
			case 9:
				hanSecond = hanSecond + "&nbsp구";
				break;
			default:
				break;
			}
			
			strTicspace.innerHTML = hanSecond + "초";
		}
	}
    
    function getMin(dnum)
    {
    	var overTen = false;
    	var sDay = "";
    	
    	if (dnum > 9) {
    		overTen = true;
			if (dnum > 19) {
				if (dnum > 29) 
				{
					if (dnum > 39) 
					{
						if (dnum > 49) {
							sDay = "오십";
							dnum = dnum - 50;
						}
						else 
						{
							sDay = "사십";
							dnum = dnum - 40;
						}
					}
					else 
					{
						sDay = "삼십";
						dnum = dnum - 30;
					}
				}
				else 
				{
					sDay = "이십";
					dnum = dnum - 20;
				}
			}
			else 
			{
				sDay = "십";
				dnum = dnum - 10;
			}
		}
    	
    	switch (dnum) {
		case 0:
			if (overTen) {
				sDay = sDay + "분";
			}
			else {
				sDay = "정각";
			}
			break;
		case 1:
			sDay = sDay + "일분";
			break;
		case 2:
			sDay = sDay + "이분";
			break;
		case 3:
			sDay = sDay + "삼분";
			break;
		case 4:
			sDay = sDay + "사분";
			break;
		case 5:
			sDay = sDay + "오분";
			break;
		case 6:
			sDay = sDay + "육분";
			break;
		case 7:
			sDay = sDay + "칠분";
			break;
		case 8:
			sDay = sDay + "팔분";
			break;
		case 9:
			sDay = sDay + "구분";
			break;
		}
    	return sDay;
    	//document.getElementById("str-minutes").innerHTML = sDay;
    }
    
    function getHour(dnum)
    {
    	var sDay = "";
    	
    	if (dnum > 11) {
        	dnum = dnum - 12;
		}
    	
    	switch (dnum) {
			case 0:
				sDay = "열두시";
				break;
			case 1:
				sDay = "한시";
				break;
			case 2:
				sDay = "두시";
				break;
			case 3:
				sDay = "세시";
				break;
			case 4:
				sDay = "네시";
				break;
			case 5:
				sDay = "다섯시";
				break;
			case 6:
				sDay = "여섯시";
				break;
			case 7:
				sDay = "일곱시";
				break;
			case 8:
				sDay = "여덟시";
				break;
			case 9:
				sDay = "아홉시";
				break;
			case 10:
				sDay = "열시";
				break;
			case 11:
				sDay = "열한시";
				break;
		}
    	return sDay;
    }
    
    function updateDate(prevDay) {
        var datetime = tizen.time.getCurrentDateTime(),
            nextInterval,
            strDay = document.getElementById("str-day"),
            strFullDate,
            getDay = datetime.getDay(),
            getDate = datetime.getDate(),
            getMonth = datetime.getMonth();
        

        // Check the update condition.
        // if prevDate is '0', it will always update the date.
        
        
        if (prevDay !== null) {
            if (prevDay === getDay) {
                /**
                 * If the date was not changed (meaning that something went wrong),
                 * call updateDate again after a second.
                 */
                nextInterval = 1000;
            } else {
                /**
                 * If the day was changed,
                 * call updateDate at the beginning of the next day.
                 */
                // Calculate how much time is left until the next day.
                nextInterval =
                    (23 - datetime.getHours()) * 60 * 60 * 1000 +
                    (59 - datetime.getMinutes()) * 60 * 1000 +
                    (59 - datetime.getSeconds()) * 1000 +
                    (1000 - datetime.getMilliseconds()) +
                    1;
            }
        }
        
        var dateString = "";
        if (getDate > 9) 
        {
			if (getDate > 19) 
			{
				if (getDate > 29) {
					dateString = "삼십";
					getDate = getDate - 30;
				}
				else 
				{
					dateString = "이십";
					getDate = getDate - 20;
				}
			}
			else 
			{
				dateString = "십";
				getDate = getDate - 10;
			}
		}
        
        switch (getDate) {
		case 0:
			dateString = dateString + "일";
			break;
		case 1:
			dateString = dateString + "일일";
			break;
		case 2:
			dateString = dateString + "이일";
			break;
		case 3:
			dateString = dateString + "삼일";
			break;
		case 4:
			dateString = dateString + "사일";
			break;
		case 5:
			dateString = dateString + "오일";
			break;
		case 6:
			dateString = dateString + "육일";
			break;
		case 7:
			dateString = dateString + "칠일";
			break;
		case 8:
			dateString = dateString + "팔일";
			break;
		case 9:
			dateString = dateString + "구일";
			break;
		}

        strFullDate = arrMonth[getMonth] + " " + dateString + " " + arrDayOfWeek[getDay];
        strDay.innerHTML = strFullDate;

        // If an updateDate timer already exists, clear the previous timer.
        if (timerUpdateDate) {
            clearTimeout(timerUpdateDate);
        }

        // Set next timeout for date update.
        timerUpdateDate = setTimeout(function() {
            updateDate(getDay);
        }, nextInterval);
    }
    

    /**
     * Updates the current time.
     * @private
     */
    function updateTime() {
        var strHours = document.getElementById("str-hours"),
            datetime = tizen.time.getCurrentDateTime(),
            hour = datetime.getHours(),
            minute = datetime.getMinutes(),
            sMin = "",
            sHour = "",
            niceTime = false;

        settingSecond(datetime.getSeconds());
        
                
        if (minute == 0) 
        {
        	if (hour == 0) 
        	{
    			strHours.innerHTML = "자정";
    			niceTime = true;
    		}
        	else if (hour == 12)
        	{
        		strHours.innerHTML = "정오";
        		niceTime = true;
			}
		}
        if (!niceTime) {
        	sMin = getMin(minute);
            sHour = getHour(hour);

            strHours.innerHTML = sHour + " " + sMin;
		}
        
        

        if (hour < 12) {
            strAmpm.innerHTML = "오전";
            if (hour < 10) {
                //strHours.innerHTML = "0" + hour;
            }
        } else {
            strAmpm.innerHTML = "오후";
        }

        if (minute < 10) {
            //strMinutes.innerHTML = "0" + minute;
        }

    }

    /**
     * Sets to background image as BACKGROUND_URL,
     * and starts timer for normal digital watch mode.
     * @private
     */
    function initDigitalWatch() {
        flagDigital = true;
        document.getElementById("digital-body").style.backgroundImage = BACKGROUND_URL;
        interval = setInterval(updateTime, 500);
        
    }

    /**
     * Clears timer and sets background image as none for ambient digital watch mode.
     * @private
     */
    function ambientDigitalWatch() {
        flagDigital = false;
        clearInterval(interval);
        document.getElementById("digital-body").style.backgroundImage = "none";
        updateTime();
    }

    /**
     * Gets battery state.
     * Updates battery level.
     * @private
     */
    function getBatteryState() {
        var batteryLevel = Math.floor(battery.level * 20),
            batteryFill = document.getElementById("battery-fill");

        batteryLevel = batteryLevel + 1;
        batteryFill.style.width = batteryLevel + "%";
    }

    /**
     * Updates watch screen. (time and date)
     * @private
     */
    function updateWatch() {
        updateTime();
        updateDate(0);
    }

    /**
     * Binds events.
     * @private
     */
    function bindEvents() {
        // add eventListener for battery state
        battery.addEventListener("chargingchange", getBatteryState);
        battery.addEventListener("chargingtimechange", getBatteryState);
        battery.addEventListener("dischargingtimechange", getBatteryState);
        battery.addEventListener("levelchange", getBatteryState);

        // add eventListener for timetick
        window.addEventListener("timetick", function() {
            ambientDigitalWatch();
        });

        // add eventListener for ambientmodechanged
        window.addEventListener("ambientmodechanged", function(e) {
            if (e.detail.ambientMode === true) {
                // rendering ambient mode case
                ambientDigitalWatch();

            } else {
                // rendering normal digital mode case
                initDigitalWatch();
            }
        });

        // add eventListener to update the screen immediately when the device wakes up.
        document.addEventListener("visibilitychange", function() {
            if (!document.hidden) {
                updateWatch();
            }
        });

        // add event listeners to update watch screen when the time zone is changed.
        tizen.time.setTimezoneChangeListener(function() {
            updateWatch();
        });
        
        var recTop = document.getElementById("rec-topmessage"),
        	recBottom = document.getElementById("rec-bottommessage"),
        	time = document.getElementById("rec-string-time");
        
        recTop.addEventListener("click", function() {
    		recTop.style.visibility = "hidden";
        });
        
        recBottom.addEventListener("click", function() {
        	recBottom.style.visibility = "hidden";
        });
        
        time.addEventListener("click", function() {
        	recTop.style.visibility = "visible";
        	recBottom.style.visibility = "visible";
        });
    }

    /**
     * Initializes date and time.
     * Sets to digital mode.
     * @private
     */
    function init() {
        initDigitalWatch();
        updateDate(0);

        bindEvents();
    }

    window.onload = init();
}());
