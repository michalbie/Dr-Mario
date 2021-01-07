"use strict";

const DoctorManager = class DoctorManager {
    constructor(doctor) {
        this.doctor = doctor;

        doctor.addEventListener("sendPill", this.throwPill);
    }

    throwPill = () => {
        document.getElementById("game-board").dispatchEvent(new Event("playThrowPillAnimation"));
        this.doctor.src = this.doctor.src;
    };
};

export { DoctorManager };
