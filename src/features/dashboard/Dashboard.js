import React from "react";
import "./Dashboard.scss";
import { Line } from "react-chartjs-2";
import Input from "../../common/components/Input";
import Button from "../../common/components/Button";
import PropTypes from "prop-types";
import dayjs from "dayjs";
import { fetchWeights, addWeight } from "./dashboardSlice";
import { connect } from "react-redux";
import isBetween from "dayjs/plugin/isBetween";
import isoWeek from "dayjs/plugin/isoWeek";
import customParseFormat from "dayjs/plugin/customParseFormat";
import "dayjs/locale/ru";
import Popup from "reactjs-popup";

dayjs.extend(customParseFormat);
dayjs.extend(isBetween);
dayjs.extend(isoWeek);

const options = {
  title: {
    display: false,
  },
  legend: {
    display: false,
  },
  scales: {
    xAxes: [
      {
        display: true,
        gridLines: { display: false },
        scaleLabel: {
          display: true,
          fontColor: "rgba(255, 255, 255, 0.5)",
          fontSize: 10,
        },
        ticks: {
          fontColor: "rgba(255, 255, 255, 0.5)",
          fontSize: 14,
        },
      },
    ],
    yAxes: [
      {
        gridLines: {
          borderDash: [3, 2],
          color: "rgba(255, 255, 255, 0.4)",
          drawBorder: false,
        },
        display: true,
        scaleLabel: {
          display: true,
          fontColor: "rgba(255, 255, 255, 0.5)",
          fontSize: 10,
        },
        ticks: {
          stepSize: 10,
          fontColor: "rgba(255, 255, 255, 0.5)",
          fontSize: 14,
        },
      },
    ],
  },
};

class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    this.handleInputChange = this.handleInputChange.bind(this);
    this.addWeight = this.addWeight.bind(this);
    this.getData = this.getData.bind(this);
    this.openPopup = this.openPopup.bind(this);
    this.closePopup = this.closePopup.bind(this);

    this.state = {
      fromTime: null,
      toTime: null,

      weight: "",
      fromTimeInput: "",
      toTimeInput: "",
      showPopup: false,
    };

    this.timeDeltaPresets = [
      { name: "Неделя", delta: [6, "days"] },
      { name: "Две недели", delta: [13, "days"] },
      { name: "Месяц", delta: [1, "month"] },
      { name: "Пол года", delta: [6, "month"] },
      { name: "Год", delta: [1, "year"] },
    ];
  }

  handleInputChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  getData() {
    const modes = [
      { step: [1, "days"], labelFormat: "dd", maxLength: 6 },
      { step: [2, "days"], labelFormat: "DD/MM", maxLength: 14 },
      { step: [4, "days"], labelFormat: "DD/MM", maxLength: 31 },
      { step: [1, "month"], labelFormat: "MMM", maxLength: 365 },
      { step: [1, "year"], labelFormat: "YYYY", maxLength: null },
    ];

    const { statistics } = this.props;
    const fromTime =
      this.state.fromTime === null
        ? dayjs().subtract(6, "days")
        : this.state.fromTime;
    const toTime = this.state.toTime === null ? dayjs() : this.state.toTime;

    let mode;
    for (const m of modes) {
      if (
        m.maxLength === null ||
        toTime.diff(fromTime, "days") <= m.maxLength
      ) {
        mode = m;
        break;
      }
    }

    const labels = [];
    const data = [];
    for (
      let curr = fromTime.startOf("days");
      curr.isBefore(toTime.endOf("days"));
      curr = curr.add(mode.step[0], mode.step[1])
    ) {
      const s = statistics
        .filter((e) =>
          dayjs
            .unix(e.time)
            .isBetween(curr, curr.add(mode.step[0], mode.step[1]))
        )
        .map((e) => e.weight);
      labels.push(
        curr
          .locale("ru")
          .format(mode.labelFormat)
          .replace(/^./g, (c) => c.toUpperCase())
      );
      data.push(
        s.length ? (s.reduce((a, b) => a + b) / s.length).toFixed(2) : undefined
      );
    }

    return (canvas) => {
      const ctx = canvas.getContext("2d");
      const greenGradient = ctx.createLinearGradient(0, 0, 0, 290);
      greenGradient.addColorStop(0, "rgba(61, 213, 152, 1)");
      greenGradient.addColorStop(1, "rgba(61, 213, 152, .1)");

      return {
        labels: labels,
        datasets: [
          {
            label: "Средний вес",
            data: data,
            backgroundColor: greenGradient,
            borderColor: ["#3dd598"],
            borderWidth: 4,

            pointBorderColor: "#fff",
            pointBackgroundColor: "rgba(61, 213, 152, 0.1)",
          },
        ],
      };
    };
  }

  addWeight() {
    this.props.addWeight(+this.state.weight);
  }

  componentDidMount() {
    this.props.fetchLastWeights(200);
  }

  closePopup() {
    this.setState({ showPopup: false });
  }

  openPopup() {
    this.setState({ showPopup: true });
  }

  selectTimeDelta(fromTime, toTime) {
    if (fromTime.isBefore(toTime)) {
      this.setState({ fromTime, toTime });
      this.props.fetchWeights(fromTime.unix(), toTime.unix());
    } else {
      this.setState({ toTime: fromTime, fromTime: toTime });
      this.props.fetchWeights(toTime.unix(), fromTime.unix());
    }
  }

  render() {
    const { statistics } = this.props;
    const { weight, showPopup, fromTimeInput, toTimeInput } = this.state;

    return (
      <div className="Dashboard">
        <Popup open={showPopup} onClose={this.closePopup}>
          <div className="Dashboard__modal">
            <div className="Dashboard__modal-title">Выбор периода</div>
            <div className="Dashboard__modal-preset">
              {this.timeDeltaPresets.map((e, i) => (
                <Button
                  key={i}
                  mode="tertiary"
                  onClick={() => {
                    this.selectTimeDelta(
                      dayjs().subtract(e.delta[0], e.delta[1]),
                      dayjs()
                    );
                    this.closePopup();
                  }}
                >
                  {e.name}
                </Button>
              ))}
            </div>
            <div className="Dashboard__modal-custom-delta">Другой</div>
            <Input
              placeholder="Начало"
              type="date"
              name="fromTimeInput"
              onChange={this.handleInputChange}
            />
            <Input
              placeholder="Конец"
              type="date"
              name="toTimeInput"
              onChange={this.handleInputChange}
            />
            <Button
              mode="primary"
              style={{ marginTop: 25 }}
              disabled={fromTimeInput === "" || toTimeInput === ""}
              onClick={() => {
                this.selectTimeDelta(
                  dayjs(fromTimeInput, "YYYY-MM-DD"),
                  dayjs(toTimeInput, "YYYY-MM-DD")
                );
                this.closePopup();
              }}
            >
              Применить
            </Button>
          </div>
        </Popup>
        <div className="Dashboard__container">
          <div className="Dashboard__left">
            <div className="Dashboard__chart-control">
              <div className="Dashboard__title">Статистика</div>
              <div className="Dashboard__date-selection">
                <Button mode="tertiary" onClick={this.openPopup}>
                  Настройки
                </Button>
              </div>
            </div>
            <div className="Dashboard__chart">
              <Line data={this.getData()} options={options} />
            </div>
          </div>
          <div className="Dashboard__right">
            <div className="Dashboard__add-weight">
              <div className="Dashboard__title">Добавить вес</div>
              <div className="Dashboard__add-weight-input">
                <Input
                  placeholder="Вес"
                  name="weight"
                  onChange={this.handleInputChange}
                />
                <Button
                  mode="primary"
                  disabled={isNaN(weight)}
                  onClick={this.addWeight}
                >
                  Добавить
                </Button>
              </div>
            </div>
            <div className="Dashboard__history">
              <div className="Dashboard__title">История</div>
              {statistics
                .sort((a, b) => b.time - a.time)
                .slice(0, 6)
                .map((v, i, a) => {
                  if (i === a.length - 1) return null;
                  const relDiff = (f, s) =>
                    100 * Math.abs((f - s) / ((f + s) / 2));

                  const diff = relDiff(a[i].weight, a[i + 1].weight);
                  const statusClass = `Dashboard__history-element-${
                    v.weight - a[i + 1].weight > 0 ? "negative" : "positive"
                  }`;

                  return (
                    <div className="Dashboard__history-element" key={v.id}>
                      <div className="Dashboard__history-element-title">
                        <div className="Dashboard__history-element-weight">
                          {v.weight} кг
                        </div>
                        <div className="Dashboard__history-element-date">
                          {dayjs.unix(v.time).format("YYYY.MM.DD HH:mm")}
                        </div>
                      </div>
                      <div
                        className={[
                          "Dashboard__history-element-diff",
                          statusClass,
                        ].join(" ")}
                      >
                        {[
                          v.weight - a[i + 1].weight > 0 ? "+" : "-",
                          diff.toFixed(2),
                          "%",
                        ].join("")}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Dashboard.propTypes = {
  statistics: PropTypes.array,
  fetchWeights: PropTypes.func,
  fetchLastWeights: PropTypes.func,
  addWeight: PropTypes.func,
};

const mapStateToProps = (state) => ({
  statistics: Object.values(state.dashboard.statistics),
});

const mapDispatchToProps = (dispatch) => ({
  fetchLastWeights: (count) => {
    dispatch(fetchWeights({ count }));
  },
  fetchWeights: (fromTime, toTime, count = 200) => {
    dispatch(fetchWeights({ from_time: fromTime, to_time: toTime, count }));
  },
  addWeight: (weight) => {
    dispatch(addWeight(weight));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
