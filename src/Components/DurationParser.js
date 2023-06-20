import { DateTime, Duration } from 'luxon';

function durationParser(durationInput) {
  const durationArray = durationInput.split(' ');

  var minutes = 0;
  var hours = 0;

  for (var duration in durationArray) {
    try {
      const durationInt = parseInt(duration.slice(0, -1));

      if (duration.slice(-1) === 'm') {
        minutes += durationInt;
      } else if (duration.slice(-1) === 'h') {
        hours += durationInt;
      } else if (durationInt >= 5) {
        minutes += durationInt;
      } else if (durationInt < 5) {
        hours += durationInt;
      } else {
        throw new Error({ message: 'Invalid duration' });
      }
    } catch {
      throw new Error({ message: 'Invalid duration' });
    }
  }

  return Duration.fromObject({ hours: hours, minutes: minutes }).toFormat(
    "h'h' m'm'"
  );
}

export default durationParser;
