import React, { Component, PropTypes } from "react";
import moment from "moment";
import classnames from "classnames";

export default class DateTimePickerDays extends Component {
  static propTypes = {
    subtractMonth: PropTypes.func.isRequired,
    addMonth: PropTypes.func.isRequired,
    viewDate: PropTypes.object.isRequired,
    selectedDate: PropTypes.object.isRequired,
    showToday: PropTypes.bool,
    calendarWeeks: PropTypes.bool,
    daysOfWeekDisabled: PropTypes.array,
    setSelectedDate: PropTypes.func.isRequired,
    showMonths: PropTypes.func.isRequired,
    minDate: PropTypes.object,
    maxDate: PropTypes.object
  }

  static defaultProps = {
    showToday: true
  }

  renderDays = () => {
    var cells, classes, days, html, month, nextMonth, prevMonth, minDate, maxDate, row, year;
    year = this.props.viewDate.year();
    month = this.props.viewDate.month();
    prevMonth = this.props.viewDate.clone().subtract(1, "months");
    days = prevMonth.daysInMonth();
    prevMonth.date(days).startOf("isoweek");
    nextMonth = moment(prevMonth).clone().add(42, "d");
    minDate = this.props.minDate ? this.props.minDate.clone().subtract(1, "days") : this.props.minDate;
    maxDate = this.props.maxDate ? this.props.maxDate.clone() : this.props.maxDate;
    html = [];
    cells = [];
    while (prevMonth.isBefore(nextMonth)) {
      classes = {
        day: true
      };
      if (prevMonth.year() < year || (prevMonth.year() === year && prevMonth.month() < month)) {
        classes.old = true;
      } else if (prevMonth.year() > year || (prevMonth.year() === year && prevMonth.month() > month)) {
        classes.new = true;
      }
      if (prevMonth.isSame(moment({
        y: this.props.selectedDate.year(),
        M: this.props.selectedDate.month(),
        d: this.props.selectedDate.date()
      }))) {
        classes.active = true;
      }
      if (this.props.showToday) {
        if (prevMonth.isSame(moment(), "day")) {
          classes.today = true;
        }
      }
      if ((minDate && prevMonth.isBefore(minDate)) || (maxDate && prevMonth.isAfter(maxDate))) {
        classes.disabled = true;
      }
      if (this.props.daysOfWeekDisabled.length > 0) classes.disabled = this.props.daysOfWeekDisabled.indexOf(prevMonth.day()) !== -1;
      if (this.props.calendarWeeks && cells.length % 8 === 0) {
        cells.push(<td className="cw" key={prevMonth.year() + "-" + prevMonth.week()}>{prevMonth.week()}</td>);
      }
      cells.push(<td className={classnames(classes)} key={prevMonth.month() + "-" + prevMonth.date()} onClick={this.props.setSelectedDate}>{prevMonth.date()}</td>);
      if (prevMonth.weekday() === moment().endOf("isoweek").weekday()) {
        row = <tr key={prevMonth.month() + "-" + prevMonth.date()}>{cells}</tr>;
        html.push(row);
        cells = [];
      }
      prevMonth.add(1, "d");
    }
    return html;
  }

  render() {
    return (
    <div className="datepicker-days" style={{display: "block"}}>
        <table className="table-condensed">
          <thead>
            <tr>
              <th className="prev" onClick={this.props.subtractMonth}><span className="glyphicon glyphicon-chevron-left" /></th>

              <th className="switch" colSpan={this.props.calendarWeeks ? 6 : 5} onClick={this.props.showMonths}>{moment.months()[this.props.viewDate.month()]} {this.props.viewDate.year()}</th>

              <th className="next" onClick={this.props.addMonth}><span className="glyphicon glyphicon-chevron-right" /></th>
            </tr>

            <tr>
              {this.props.calendarWeeks ? <th></th> : null}

              {[1, 2, 3, 4, 5, 6, 7].map(function(day) {
                return <th className="dow" key={day}>{moment().isoWeekday(day).format("dd")}</th>;
              })}

            </tr>
          </thead>

          <tbody>
            {this.renderDays()}
          </tbody>
        </table>
      </div>
    );
  }
}
