import calendarUtil from './calendarUtil';

const scheduleUtil = {
  scheduleCompareFunction: (date1, date2) => {
    const startDateInt1 = calendarUtil.parseIntFromDateStr(date1.startDate);
    const startDateInt2 = calendarUtil.parseIntFromDateStr(date2.startDate);

    if (startDateInt1 != startDateInt2) {
      return startDateInt1 - startDateInt2;
    }

    const endDateInt1 = calendarUtil.parseIntFromDateStr(date1.endDate);
    const endDateInt2 = calendarUtil.parseIntFromDateStr(date2.endDate);

    if (endDateInt1 != endDateInt2) {
      return endDateInt2 - endDateInt1;
    }

    const content1 = date1.content;
    const content2 = date2.content;

    if (content1 < content2) {
      return -1;
    } else if (content1 > content2) {
      return 1;
    }

    return 0;
  },
};

export default scheduleUtil;
