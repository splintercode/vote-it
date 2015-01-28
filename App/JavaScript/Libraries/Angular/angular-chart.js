(function() {
    "use strict";

    //Chart.defaults.global.colours[2] = {
    //    fillColor: "#b9b9b9"
    //}

    Chart.defaults.global.responsive = true;
    Chart.defaults.global.multiTooltipTemplate = "<%if (datasetLabel){%><%=datasetLabel%>: <%}%><%= value %>";

    Chart.defaults.global.colours = [
      { // vote green
          fillColor: "#6DB075",
          strokeColor: "#6DB075",
          pointColor: "#6DB075",
          pointStrokeColor: "#6DB075",
          pointHighlightFill: "#6DB075",
          pointHighlightStroke: "#6DB075"
      },
      { // vote red
          fillColor: "#D76450",
          strokeColor: "#D76450",
          pointColor: "#D76450",
          pointStrokeColor: "#fff",
          pointHighlightFill: "#fff",
          pointHighlightStroke: "#D76450"
      },
      { // vote grey
          fillColor: "#b9b9b9",
          strokeColor: "#b9b9b9",
          pointColor: "#b9b9b9",
          pointStrokeColor: "#fff",
          pointHighlightFill: "#fff",
          pointHighlightStroke: "#b9b9b9"
      },
      { // green
          fillColor: "rgba(70,191,189,0.2)",
          strokeColor: "rgba(70,191,189,1)",
          pointColor: "rgba(70,191,189,1)",
          pointStrokeColor: "#fff",
          pointHighlightFill: "#fff",
          pointHighlightStroke: "rgba(70,191,189,0.8)"
      },
      { // yellow
          fillColor: "rgba(253,180,92,0.2)",
          strokeColor: "rgba(253,180,92,1)",
          pointColor: "rgba(253,180,92,1)",
          pointStrokeColor: "#fff",
          pointHighlightFill: "#fff",
          pointHighlightStroke: "rgba(253,180,92,0.8)"
      },
      { // grey
          fillColor: "rgba(148,159,177,0.2)",
          strokeColor: "rgba(148,159,177,1)",
          pointColor: "rgba(148,159,177,1)",
          pointStrokeColor: "#fff",
          pointHighlightFill: "#fff",
          pointHighlightStroke: "rgba(148,159,177,0.8)"
      },
      { // dark grey
          fillColor: "rgba(77,83,96,0.2)",
          strokeColor: "rgba(77,83,96,1)",
          pointColor: "rgba(77,83,96,1)",
          pointStrokeColor: "#fff",
          pointHighlightFill: "#fff",
          pointHighlightStroke: "rgba(77,83,96,1)"
      }
    ];

    angular.module("chart.js", [])
      .directive("chartBase", function() { return chart(); })
      .directive("chartLine", function() { return chart('Line'); })
      .directive("chartBar", function() { return chart('Bar'); })
      .directive("chartRadar", function() { return chart('Radar'); })
      .directive("chartDoughnut", function() { return chart('Doughnut'); })
      .directive("chartPie", function() { return chart('Pie'); })
      .directive("chartPolarArea", function() { return chart('PolarArea'); });

    function chart(type) {
        return {
            restrict: 'CA',
            scope: {
                data: '=',
                labels: '=',
                options: '=',
                series: '=',
                colours: '=',
                chartType: '=',
                legend: '@',
                click: '='
            },
            link: function(scope, elem, attrs) {
                var chart, container = document.createElement('div');
                container.className = 'chart-container';
                elem.replaceWith(container);
                container.appendChild(elem[0]);

                if (typeof G_vmlCanvasManager === 'object' && G_vmlCanvasManager !== null) {
                    if (typeof G_vmlCanvasManager.initElement === 'function') {
                        G_vmlCanvasManager.initElement(elem[0]);
                    }
                }

                scope.$watch('data', function(newVal, oldVal) {
                    if (!newVal || !newVal.length || (Array.isArray(newVal[0]) && !newVal[0].length)) return;
                    var chartType = type || scope.chartType;
                    if (!chartType) return;

                    if (chart) {
                        if (canUpdateChart(newVal, oldVal)) return updateChart(chart, newVal, scope);
                        chart.destroy();
                    }

                    chart = createChart(chartType, scope, elem);
                }, true);

                scope.$watch('series', resetChart, true);
                scope.$watch('labels', resetChart, true);

                scope.$watch('chartType', function(newVal, oldVal) {
                    if (!newVal) return;
                    if (chart) chart.destroy();
                    chart = createChart(newVal, scope, elem);
                });

                function resetChart(newVal, oldVal) {
                    if (!newVal || !newVal.length) return;
                    var chartType = type || scope.chartType;
                    if (!chartType) return;

                    // chart.update() doesn't work for series and labels
                    // so we have to re-create the chart entirely
                    if (chart) chart.destroy();

                    chart = createChart(chartType, scope, elem);
                }
            }
        };
    }

    function canUpdateChart(newVal, oldVal) {
        if (newVal && oldVal && newVal.length && oldVal.length) {
            return Array.isArray(newVal[0]) ?
              newVal.length === oldVal.length && newVal[0].length === oldVal[0].length :
              oldVal.reduce(sum, 0) > 0 ? newVal.length === oldVal.length : false;
        }
        return false;
    }

    function sum(carry, val) {
        return carry + val;
    }

    function createChart(type, scope, elem) {
        if (!scope.data || !scope.data.length) return;
        var cvs = elem[0], ctx = cvs.getContext("2d");
        var data = Array.isArray(scope.data[0]) ?
          getDataSets(scope.labels, scope.data, scope.series || [], scope.colours) :
          getData(scope.labels, scope.data, scope.colours);
        var chart = new Chart(ctx)[type](data, scope.options || {});
        if (scope.click) {
            cvs.onclick = function(evt) {
                var click = chart.getPointsAtEvent || chart.getBarsAtEvent || chart.getSegmentsAtEvent;

                if (click) {
                    var activePoints = click.call(chart, evt);
                    scope.click(activePoints, evt);
                    scope.$apply();
                }
            };
        }
        if (scope.legend && scope.legend !== 'false') setLegend(elem, chart);
        return chart;
    }

    function setLegend(elem, chart) {
        var $parent = elem.parent(),
            $oldLegend = $parent.find('chart-legend'),
            legend = '<chart-legend>' + chart.generateLegend() + '</chart-legend>';
        if ($oldLegend.length) $oldLegend.replaceWith(legend);
        else $parent.append(legend);
    }

    function updateChart(chart, values, scope) {
        if (Array.isArray(scope.data[0])) {
            chart.datasets.forEach(function(dataset, i) {
                if (scope.colours) updateColours(dataset, scope.colours[i]);
                (dataset.points || dataset.bars).forEach(function(dataItem, j) {
                    dataItem.value = values[i][j];
                });
            });
        } else {
            chart.segments.forEach(function(segment, i) {
                segment.value = values[i];
                if (scope.colours) updateColours(segment, scope.colours[i]);
            });
        }
        chart.update();
    }

    function updateColours(item, colour) {
        item.fillColor = colour.fillColor;
        item.highlightColor = colour.highlightColor;
        item.strokeColor = colour.strokeColor;
        item.pointColor = colour.pointColor;
        item.pointStrokeColor = colour.pointStrokeColor;
    }

    function getDataSets(labels, data, series, colours) {
        colours = colours || Chart.defaults.global.colours;
        return {
            labels: labels,
            datasets: data.map(function(item, i) {
                var dataSet = clone(colours[i]);
                dataSet.label = series[i];
                dataSet.data = item;
                return dataSet;
            })
        };
    }

    function clone(obj) {
        var newObj = {};
        for (var key in obj) {
            if (obj.hasOwnProperty(key))
                newObj[key] = obj[key];
        }
        return newObj;
    }

    function getData(labels, data, colours) {
        colours = colours || Chart.defaults.global.colours;
        return labels.map(function(label, i) {
            return {
                label: label,
                value: data[i],
                color: colours[i].strokeColor,
                highlight: colours[i].pointHighlightStroke
            };
        });
    }

})();