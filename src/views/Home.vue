<template>
	<div class="chat text-white">
		<div class="container-fluid">
			<div class="row text-white">
				<div class="col-md-12 message">
					<h2 class="text-center">Dix-cordes</h2>
					<h4 class="text-center">Imaginez un endroit...</h4>
					<h5 class="text-center">
						...où vous pouvez échanger des messages en toute
						sécurité.
					</h5>
				</div>
				<div class="col-12 my-2 p-5 d-flex justify-content-center">
					<div class="w-25">
						<router-link to="/app"
							><button
								type="button"
								class="btn btn-block btn-lg btn-warning"
							>
								Ouvrez l'application dans votre navigateur
							</button></router-link
						>
					</div>
				</div>
			</div>
		</div>
		<div class="container text-white">
			<div class="row p-4 my-3 message">
				<div class="col-md-4 my-auto">
					<img
						style="height: 80%; width: 80%"
						class="p-20"
						src="../assets/images/keyboard.png"
					/>
				</div>
				<div class="col-md-8 my-auto">
					<h2>
						Un système de messagerie ultra-sécurisé pour le
						président de la république grâce à un clavier du visuel
						qui remplace le clavier physique.
					</h2>
					<span>Empêche tout keylogger de fonctionner.</span>
				</div>
			</div>
			<div class="row p-4 my-3 message">
				<div class="col-md-8 my-auto">
					<h1>
						Un système de contacts pratique et ultra-sécurisé grâce
						à des surnoms customisables pour tromper l'espionneur.
					</h1>
				</div>
				<div class="col-md-4 my-auto">
					<img
						style="height: 80%; width: 80%"
						class="p-20"
						src="../assets/images/contacts.png"
					/>
				</div>
			</div>
		</div>
		<h2 class="mt-5">Les artistes en parlent</h2>
		<div class="row m-2 my-5 text-white">
			<div class="col-lg-4">
				<div class="row">
					<div class="col-md-4 col-5">
						<img
							class="rounded-circle h-auto w-100"
							width="140"
							height="140"
							src="../assets/images/blackm.jpg"
						/>
					</div>
					<div class="col-md-8 col-7 my-auto py-3">
						<div class="review-block-rate">
							<button
								type="button"
								class="btn btn-warning btn-xs"
								aria-label="Left Align"
							>
								<span
									class="fas fa-star"
									aria-hidden="true"
								></span>
							</button>
							<button
								type="button"
								class="btn btn-warning btn-xs"
								aria-label="Left Align"
							>
								<span
									class="fas fa-star"
									aria-hidden="true"
								></span>
							</button>
							<button
								type="button"
								class="btn btn-warning btn-xs"
								aria-label="Left Align"
							>
								<span
									class="fas fa-star"
									aria-hidden="true"
								></span>
							</button>
							<button
								type="button"
								class="btn btn-default btn-grey btn-xs"
								aria-label="Left Align"
							>
								<span
									class="fas fa-star"
									aria-hidden="true"
								></span>
							</button>
							<button
								type="button"
								class="btn btn-default btn-grey btn-xs"
								aria-label="Left Align"
							>
								<span
									class="fas fa-star"
									aria-hidden="true"
								></span>
							</button>
						</div>
					</div>
				</div>
				<h2>Black M.</h2>
				<p>
					Trop bien ce placement de produit. C'est le seul outil que
					j'utilise lors de mes tournées pour éviter que toute les
					jessica viennent me harceler.
				</p>
			</div>
			<div class="col-lg-4">
				<div class="row">
					<div class="col-md-4 col-5">
						<img
							class="rounded-circle h-auto w-100"
							width="140"
							height="140"
							src="../assets/images/vianney.png"
						/>
					</div>
					<div class="col-md-8 col-7 my-auto py-3">
						<div class="review-block-rate">
							<button
								type="button"
								class="btn btn-warning btn-xs"
								aria-label="Left Align"
							>
								<span
									class="fas fa-star"
									aria-hidden="true"
								></span>
							</button>
							<button
								type="button"
								class="btn btn-warning btn-xs"
								aria-label="Left Align"
							>
								<span
									class="fas fa-star"
									aria-hidden="true"
								></span>
							</button>
							<button
								type="button"
								class="btn btn-warning btn-xs"
								aria-label="Left Align"
							>
								<span
									class="fas fa-star"
									aria-hidden="true"
								></span>
							</button>
							<button
								type="button"
								class="btn btn-warning btn-xs"
								aria-label="Left Align"
							>
								<span
									class="fas fa-star"
									aria-hidden="true"
								></span>
							</button>
							<button
								type="button"
								class="btn btn-warning btn-xs"
								aria-label="Left Align"
							>
								<span
									class="fas fa-star"
									aria-hidden="true"
								></span>
							</button>
						</div>
					</div>
				</div>
				<h2>Vianney</h2>
				<p>
					Je peux collaborer avec d'autres artistes en toute sécurité.
					Depuis que j'utilise le super clavier visuel du futur, je ne
					crains plus de me faire voler mes paroles très, très
					recherchées.
				</p>
			</div>
			<div class="col-lg-4">
				<div class="row">
					<div class="col-md-4 col-5">
						<img
							class="rounded-circle h-auto w-100"
							width="140"
							height="140"
							src="../assets/images/booba.jpg"
						/>
					</div>
					<div class="col-md-8 col-7 my-auto py-3">
						<div class="review-block-rate">
							<button
								type="button"
								class="btn btn-warning btn-xs"
								aria-label="Left Align"
							>
								<span
									class="fas fa-star"
									aria-hidden="true"
								></span>
							</button>
							<button
								type="button"
								class="btn btn-warning btn-xs"
								aria-label="Left Align"
							>
								<span
									class="fas fa-star"
									aria-hidden="true"
								></span>
							</button>
							<button
								type="button"
								class="btn btn-default btn-grey btn-xs"
								aria-label="Left Align"
							>
								<span
									class="fas fa-star"
									aria-hidden="true"
								></span>
							</button>
							<button
								type="button"
								class="btn btn-default btn-grey btn-xs"
								aria-label="Left Align"
							>
								<span
									class="fas fa-star"
									aria-hidden="true"
								></span>
							</button>
							<button
								type="button"
								class="btn btn-default btn-grey btn-xs"
								aria-label="Left Align"
							>
								<span
									class="fas fa-star"
									aria-hidden="true"
								></span>
							</button>
						</div>
					</div>
				</div>
				<h2>Booba</h2>
				<p>
					Depuis le covid, les libertés sont mortes mais grâce à
					Dix-Codres j'peux insulter les influvoleurs et tous les gens
					d'extrême droite sans me faire repérer. EASY.
				</p>
			</div>
		</div>
		<div class="p-4 mt-3 message text-white">
			<div class="col-md-2">
				<img
					class="rounded-circle"
					width="140"
					height="140"
					src="../assets/images/macron.jpg"
				/>
			</div>
			<div class="col-md-10 my-auto py-3">
				<div class="review-block-rate">
					<button
						type="button"
						class="btn btn-warning btn-xs"
						aria-label="Left Align"
					>
						<span class="fas fa-star" aria-hidden="true"></span>
					</button>
					<button
						type="button"
						class="btn btn-warning btn-xs"
						aria-label="Left Align"
					>
						<span class="fas fa-star" aria-hidden="true"></span>
					</button>
					<button
						type="button"
						class="btn btn-warning btn-xs"
						aria-label="Left Align"
					>
						<span class="fas fa-star" aria-hidden="true"></span>
					</button>
					<button
						type="button"
						class="btn btn-warning btn-xs"
						aria-label="Left Align"
					>
						<span class="fas fa-star" aria-hidden="true"></span>
					</button>
					<button
						type="button"
						class="btn btn-warning btn-xs"
						aria-label="Left Align"
					>
						<span class="fas fa-star" aria-hidden="true"></span>
					</button>
				</div>
			</div>
			<div class="col-12 py-2">
				<h2>Le directeur de la Gaule</h2>
			</div>
			<div class="col-12">
				Depuis que j'utilise Dix-cordes, je peux faire passer des
				réformes en toute sécurité.
			</div>
		</div>
		<footer class="col-12 text-white message align-self-end">
			<div class="text-center py-5">
				<span>DIX-CORDES {{ new Date().getFullYear() }} - </span>
				<a href="https://github.com/Zulivan/dix-cordes"
					><i class="fab fa-github"></i> Code source</a
				>
			</div>
		</footer>
	</div>
</template>

<script></script>
