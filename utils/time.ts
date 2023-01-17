export const getAlertTimesByDuration = (
    startTime: Date,
    duration: number, // interval in hours
    interval: number = 15 // interval in minutes
) => {
    const endTime = new Date(startTime.getTime() + duration * 60 * 60 * 1000);

    return getAlertTimesByEndTime(startTime, endTime, interval);
};

export const getAlertTimesByEndTime = (
    startTime: Date,
    endTime: Date,
    interval: number = 15 // interval in minutes
): Date[] => {
    const intervalInMilliseconds = interval * 60 * 1000;
    const output = [];
    let next = startTime;
    while (next < endTime) {
        output.push(next);
        next = new Date(next.getTime() + intervalInMilliseconds);
    }
    return output;
};

export const getNextQuarterHour = (currentTime: Date) => {
    const outputTime = new Date(currentTime.getTime());
    const minutes = currentTime.getMinutes();
    const next15 = getNextMultipleOf15(minutes);

    outputTime.setSeconds(0);
    outputTime.setMilliseconds(0);

    if (next15 > 60) {
      outputTime.setMinutes(0);
      outputTime.setHours(currentTime.getHours() + 1);
      return outputTime;
    } else {
      outputTime.setMinutes(next15);
      return outputTime;
    }
};


const getNextMultipleOf15 = (num: number) => {
  if (num % 15 > 0) {
    return num + (15 - num % 15);
  }
  return num;
};
