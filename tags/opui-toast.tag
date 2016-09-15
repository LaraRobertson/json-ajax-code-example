<opui-toast>

	<div class="toasts { opts.position }" if="{ toasts.length > 0 }">
		<div class="toast" each="{ toasts }" onclick="{ parent.toastClicked }">
			{ text }<span if="{action}" class="toast-action">{action}</span>
		</div>
	</div>

	<script>

		/**
		 * Toast object properties
		{
			text: 'You have received an update to something interesting',
			sticky: true,
			timeout: 6000,
			onclick: function (e) {...},
			onclose: function () {...}
		}
		*/

		var self = this;

		self.toasts = [];

		if (!opts.position) opts.position = 'topright';

		self.toastClicked = function (e) {
			if (e.item.onclick) e.item.onclick(e);
			if (e.item.onclose) e.item.onclose();
			window.clearTimeout(e.item.timer);
			self.toasts.splice(self.toasts.indexOf(e.item), 1);
		};

		opui.events.subscribe('toast', function(obj){
			self.toasts.push(obj);
			self.update();
		});

		self.on('update', function () {
			self.toasts.forEach(function (toast) {
				toast.id = Math.random().toString(36).substr(2, 8);
				if (!toast.timer && !toast.sticky) {
					toast.startTimer = function () {
						toast.timer = window.setTimeout(function () {
							self.toasts.splice(self.toasts.indexOf(toast), 1);
							if (toast.onclose) toast.onclose();
							self.update();
						}, toast.timeout || 6000);
					};
					toast.startTimer();
				}
			});
		});
	</script>

	<style scoped>

		.toasts {
			position: fixed;
			max-width: 350px;
			max-height: 100%;
			overflow-y: auto;
			background-color: transparent;
			z-index: 101;
		}

		.toasts.topleft {
			top: 0;
			left: 0;
		}

		.toasts.topright {
			top: 0;
			right: 0;
		}

		.toasts.bottomleft {
			bottom: 0;
			left: 0;
		}

		.toasts.bottomright {
			bottom: 0;
			right: 0;
		}

		.toast {
			padding: 20px;
			margin: 20px;
			background-color: rgba(0, 0, 0, 0.8);
			color: white;
			font-size: 13px;
			cursor: pointer;
		}

		.toast-action {
			float: right;
			color: orange;
			font-weight: bold;
			margin-left: 25px;
		}

	</style>

</opui-toast>
