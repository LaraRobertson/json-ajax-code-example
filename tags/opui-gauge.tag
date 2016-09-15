<opui-gauge>
	<div id="gauge-holder" >
		<div id="completionWrapper" style="position: absolute;">
			<span id="completion" style="line-height: 21px;">{total} <span class="complete">Complete</span></span>
		</div>
		<canvas id="gauge-area" width={opts.width} height={opts.height}></canvas>

	</div>


	<!-- Script -->

	
	<script>
		var self = this;

		if(opts.hasOwnProperty('tag')){
			var tag = opts.tag
		}

		if(opts.hasOwnProperty('value')){
			var progress = opts.value;
		} else {
			var assignments = opui.store.getStore('assignments')

			var completeCount = assignments.filter(function(item){
				return ( item.status <= 2 );
			}).length;

			var totalCount = assignments.length;

			var progress = Math.floor((completeCount / totalCount) * 100) ? Math.floor((completeCount / totalCount) * 100) : 0;
		}

		self.total = progress;
		self.total += '%';
		self.progress = progress;

		self.on('mount', function(){
			if(!self.myGaugeChart) {
				var guageData = [{
					value: parseInt(opts.value),
					color: "#1C8FCF",
					highlight: "#22B0FF",
					label: "Completed"
				},{
					value: 100 - parseInt(opts.value),
					color: "#e1e1e1",
					highlight: "#efefef",
					label: "Incomplete"
				}];

				opui.console.log(guageData);

				var ctx = self.root.querySelector('canvas') ? self.root.querySelector('canvas').getContext("2d") : null;

				self.myGaugeChart = new Chart(ctx).Doughnut(guageData, {
					responsive:true,
					showTooltips: false,
					scaleShowLabelBackdrop: false,
					scaleShowLine: false,
					animation: true,
					animationEasing: 'easeOutBounce',
					animateRotate: true,
					animateScale: true,
					animationSteps: 20,
					scaleShowLabels: false,
					percentageInnerCutout : 75,
					segmentStrokeWidth: 3,
				});

				self.myGaugeChart.update();
			}

		})

	</script>


</opui-gauge>
