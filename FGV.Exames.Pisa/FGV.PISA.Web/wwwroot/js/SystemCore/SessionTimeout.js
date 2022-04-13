var sessionTimeout;

$.ajax({
    url: '/login/SessionTimeout',
    dataType: "json",
    async: false,
    type: "POST"
}).done(function (data) {
        sessionTimeout = data.timeSessionExpiration * 60 * 1000;//Milisegungos
    });

var isTimeOut = false;
var sessionIntervalID, idleIntervalID, remainingTimerIntervalID;
var isIdleTimerOn = false;
localStorage.setItem('sessionSlide', 'isStarted');

$(window).scroll(function (e) {
    localStorage.setItem('sessionSlide', 'isStarted');
    startIdleTime();
});

function initSessionMonitor() {
    $(document).bind('keypress.session', function (e) {
        sessKeyPressed(e);
    });

    $(document).bind('mousedown keydown', function (e) {
        sessKeyPressed(e);
    });

    sessionServerAlive();
    startIdleTime();
}

function sessKeyPressed(e) {
    var target = e ? e.target : window.event.srcElement;
    var sessionTarget = $(target).parents("#session-expire-warning-modal").length;

    if (sessionTarget != null && sessionTarget != undefined) {
        if (e.target.id != "btnSessionModal" && e.currentTarget.activeElement.id != "session-expire-warning-modal" && e.target.id != "btnExpiredOk"
            && e.currentTarget.activeElement.className != "modal fade modal-overflow in" && e.currentTarget.activeElement.className != 'modal-header'
            && sessionTarget != 1 && e.target.id != "session-expire-warning-modal") {
            localStorage.setItem('sessionSlide', 'isStarted');
            startIdleTime();
        }
    }
}

function sessionServerAlive() {
     sessionIntervalID = setInterval(() => {
        if (!isTimeOut) {
            $.ajax({
                url: '/login/SessionTimeout',
                dataType: "json",
                async: false,
                type: "POST"
            })
                .done(function (data) {
                    if (!data.serverIsAlive)
                        sessionLogOut();
            });
            return true;
        }           
     }, sessionTimeout - 20000);// 10 segundos antes que caduque el tiempo de session. Hará un ping al servidor para mantenerlo vivo.
}

function startIdleTime() {
    clearInterval(idleIntervalID);
    clearInterval(remainingTimerIntervalID);
    localStorage.setItem("sessIdleTimeCounter", $.now());
    idleIntervalID = setInterval(() => {
        var idleTime = (parseInt(localStorage.getItem('sessIdleTimeCounter')) + (sessionTimeout));
        if ($.now() > idleTime + 60000) {
            $("#session-expire-warning-modal").modal('hide');
            clearInterval(sessionIntervalID);
            clearInterval(idleIntervalID);

            isTimeOut = true;
            sessionLogOut();
        }
        else if ($.now() > idleTime) {
            if (!isIdleTimerOn) {
                localStorage.setItem('sessionSlide', false);
                countdownDisplay();

                $("#seconds-timer").empty();
                $("#session-expire-warning-modal").modal('show');

                isIdleTimerOn = true;
            }
        }
    }, 1000);
    isIdleTimerOn = false;
}

$("#btnOk").click(function () {
    $("#session-expire-warning-modal").modal('hide');
    startIdleTime();
    clearInterval(remainingTimerIntervalID);
    localStorage.setItem('sessionSlide', 'isStarted');
});

$("#btnLogoutNow").click(function () {
    localStorage.setItem('sessionSlide', 'loggedOut');
    sessionLogOut();
});

function countdownDisplay() {
    var dialogDisplaySeconds = 60;

    remainingTimerIntervalID = setInterval(function () {
        if (localStorage.getItem('sessionSlide') == "isStarted") {
            $("#session-expire-warning-modal").modal('hide');
            startIdleTime();
            clearInterval(remainingTimerIntervalID);
        }
        else if (localStorage.getItem('sessionSlide') == "loggedOut") {
            $("#session-expire-warning-modal").modal('hide');
        }
        else {
            $('#seconds-timer').html(dialogDisplaySeconds);
            dialogDisplaySeconds -= 1;
        }
    }, 1000);
};

function sessionLogOut() {
    localStorage.clear();
    window.location = "/login/Logout";
}
