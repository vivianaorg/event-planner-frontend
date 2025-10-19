import React from 'react';
import styles from './asistentePanel.module.css';
import Header from '../../layouts/Header/header';

import informationIcon from '../../assets/information.png';
import filterIcon from '../../assets/filter.png';

const AsistentePanel = () => {
	return (
		<div className={styles.asistentePanel}>
			<Header />
			<div className={styles.app}>
				<div className={styles.container}>
					<div className={styles.asistentePanelContainer}>
						<div className={styles.paragraph}>
							<b className={styles.catlogoDeEventos}>Catálogo de Eventos</b>
						</div>
					</div>
					<div className={styles.container2}>
						<img className={styles.icon} src={informationIcon} alt="Información" />
						<div className={styles.container3}>
							<div className={styles.asistentePanelParagraph}>
								<b className={styles.instrucciones}>Instrucciones</b>
							</div>
							<div className={styles.paragraph2}>
								<div className={styles.exploreTodosLos}>Explore todos los eventos disponibles y activos. Utilice los filtros para encontrar eventos según fecha, tipo o estado.</div>
							</div>
						</div>
					</div>
					<div className={styles.container4}>
						<div className={styles.container5}>
							<img className={styles.icon} src={filterIcon} alt="Filtros de búsqueda" />
							<div className={styles.paragraph3}>
								<div className={styles.filtrosDeBsqueda}>Filtros de Búsqueda</div>
							</div>
						</div>
						<div className={styles.container6}>
							<div className={styles.container7}>
								<div className={styles.input}>
									<div className={styles.buscarEvento}>Buscar evento...</div>
								</div>
								<img className={styles.icon3} alt="" />
							</div>
							<div className={styles.primitivebutton}>
								<div className={styles.primitivespan}>
									<div className={styles.todosLosEstados}>Todos los estados</div>
								</div>
								<img className={styles.asistentePanelIcon} alt="" />
							</div>
							<div className={styles.asistentePanelPrimitivebutton}>
								<div className={styles.asistentePanelPrimitivespan}>
									<div className={styles.todosLosTipos}>Todos los tipos</div>
								</div>
								<img className={styles.asistentePanelIcon} alt="" />
							</div>
						</div>
						<div className={styles.label}>
							<div className={styles.checkbox} />
							<div className={styles.text}>
								<div className={styles.mostrarEventosCancelados}>Mostrar eventos cancelados</div>
							</div>
						</div>
					</div>
					<div className={styles.container8}>
						<div className={styles.eventcard}>
							<div className={styles.container9}>
								<img className={styles.imagewithfallbackIcon} alt="" />
								<div className={styles.badge}>
									<div className={styles.abierto}>Abierto</div>
								</div>
							</div>
							<div className={styles.container10}>
								<div className={styles.heading3}>
									<div className={styles.conferenciaAnualDe}>Conferencia Anual de Tecnología 2025</div>
								</div>
								<div className={styles.container11}>
									<div className={styles.container12}>
										<img className={styles.checkbox} alt="" />
										<div className={styles.asistentePanelText}>
											<div className={styles.deNoviembre2025}>15 de Noviembre, 2025</div>
										</div>
									</div>
									<div className={styles.container12}>
										<img className={styles.checkbox} alt="" />
										<div className={styles.text2}>
											<div className={styles.centroDeConvenciones}>Centro de Convenciones, Bogotá</div>
										</div>
									</div>
									<div className={styles.container14}>
										<div className={styles.text3}>
											<div className={styles.presencial}>Presencial</div>
										</div>
										<div className={styles.container15}>
											<img className={styles.checkbox} alt="" />
											<div className={styles.text4}>
												<div className={styles.presencial}>250</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className={styles.asistentePanelEventcard}>
							<div className={styles.container9}>
								<img className={styles.imagewithfallbackIcon} alt="" />
								<div className={styles.badge}>
									<div className={styles.abierto}>Abierto</div>
								</div>
							</div>
							<div className={styles.container10}>
								<div className={styles.heading3}>
									<div className={styles.festivalDeMsica}>Festival de Música en Vivo - Edición Primavera</div>
								</div>
								<div className={styles.container11}>
									<div className={styles.container12}>
										<img className={styles.checkbox} alt="" />
										<div className={styles.asistentePanelText}>
											<div className={styles.asistentePanelDeNoviembre2025}>22 de Noviembre, 2025</div>
										</div>
									</div>
									<div className={styles.container12}>
										<img className={styles.checkbox} alt="" />
										<div className={styles.text6}>
											<div className={styles.parqueSimnBolvar}>Parque Simón Bolívar, Bogotá</div>
										</div>
									</div>
									<div className={styles.container14}>
										<div className={styles.text3}>
											<div className={styles.presencial}>Presencial</div>
										</div>
										<div className={styles.container15}>
											<img className={styles.checkbox} alt="" />
											<div className={styles.text4}>
												<div className={styles.presencial}>500</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className={styles.eventcard2}>
							<div className={styles.container9}>
								<img className={styles.imagewithfallbackIcon} alt="" />
								<div className={styles.badge2}>
									<div className={styles.enCurso}>En Curso</div>
								</div>
							</div>
							<div className={styles.container10}>
								<div className={styles.heading3}>
									<div className={styles.reuninEstratgicaDe}>Reunión Estratégica de Negocios</div>
								</div>
								<div className={styles.container11}>
									<div className={styles.container12}>
										<img className={styles.checkbox} alt="" />
										<div className={styles.text9}>
											<div className={styles.deOctubre2025}>28 de Octubre, 2025</div>
										</div>
									</div>
									<div className={styles.container12}>
										<img className={styles.checkbox} alt="" />
										<div className={styles.text10}>
											<div className={styles.hotelHiltonMedelln}>Hotel Hilton, Medellín</div>
										</div>
									</div>
									<div className={styles.container14}>
										<div className={styles.text3}>
											<div className={styles.presencial}>Presencial</div>
										</div>
										<div className={styles.container29}>
											<img className={styles.icon12} alt="" />
											<div className={styles.text12}>
												<div className={styles.presencial}>50</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className={styles.eventcard3}>
							<div className={styles.container9}>
								<img className={styles.imagewithfallbackIcon} alt="" />
								<div className={styles.badge}>
									<div className={styles.abierto}>Abierto</div>
								</div>
							</div>
							<div className={styles.container10}>
								<div className={styles.heading3}>
									<div className={styles.tallerDeDesarrollo}>Taller de Desarrollo de Liderazgo</div>
								</div>
								<div className={styles.container11}>
									<div className={styles.container12}>
										<img className={styles.checkbox} alt="" />
										<div className={styles.text13}>
											<div className={styles.deDiciembre2025}>05 de Diciembre, 2025</div>
										</div>
									</div>
									<div className={styles.container12}>
										<img className={styles.checkbox} alt="" />
										<div className={styles.text14}>
											<div className={styles.universidadNacionalBogot}>Universidad Nacional, Bogotá</div>
										</div>
									</div>
									<div className={styles.container14}>
										<div className={styles.text3}>
											<div className={styles.presencial}>Presencial</div>
										</div>
										<div className={styles.container29}>
											<img className={styles.icon12} alt="" />
											<div className={styles.text12}>
												<div className={styles.presencial}>80</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className={styles.eventcard4}>
							<div className={styles.container9}>
								<img className={styles.imagewithfallbackIcon} alt="" />
								<div className={styles.badge}>
									<div className={styles.abierto}>Abierto</div>
								</div>
							</div>
							<div className={styles.container10}>
								<div className={styles.heading3}>
									<div className={styles.eventoDeNetworking}>Evento de Networking Empresarial</div>
								</div>
								<div className={styles.container11}>
									<div className={styles.container12}>
										<img className={styles.checkbox} alt="" />
										<div className={styles.text13}>
											<div className={styles.asistentePanelDeDiciembre2025}>12 de Diciembre, 2025</div>
										</div>
									</div>
									<div className={styles.container12}>
										<img className={styles.checkbox} alt="" />
										<div className={styles.text18}>
											<div className={styles.clubElNogal}>Club El Nogal, Bogotá</div>
										</div>
									</div>
									<div className={styles.container14}>
										<div className={styles.text3}>
											<div className={styles.presencial}>Presencial</div>
										</div>
										<div className={styles.container15}>
											<img className={styles.checkbox} alt="" />
											<div className={styles.text4}>
												<div className={styles.presencial}>120</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className={styles.eventcard5}>
							<div className={styles.container9}>
								<img className={styles.imagewithfallbackIcon} alt="" />
								<div className={styles.badge5}>
									<div className={styles.abierto}>Abierto</div>
								</div>
							</div>
							<div className={styles.container10}>
								<div className={styles.heading3}>
									<div className={styles.webinarTendenciasDigitales}>Webinar: Tendencias Digitales 2025</div>
								</div>
								<div className={styles.container11}>
									<div className={styles.container12}>
										<img className={styles.checkbox} alt="" />
										<div className={styles.asistentePanelText}>
											<div className={styles.deNoviembre20252}>20 de Noviembre, 2025</div>
										</div>
									</div>
									<div className={styles.container12}>
										<img className={styles.checkbox} alt="" />
										<div className={styles.text22}>
											<div className={styles.plataformaZoom}>Plataforma Zoom</div>
										</div>
									</div>
									<div className={styles.container14}>
										<div className={styles.text23}>
											<div className={styles.presencial}>Virtual</div>
										</div>
										<div className={styles.container15}>
											<img className={styles.checkbox} alt="" />
											<div className={styles.text4}>
												<div className={styles.presencial}>300</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className={styles.eventcard6}>
							<div className={styles.container9}>
								<img className={styles.imagewithfallbackIcon} alt="" />
								<div className={styles.badge6}>
									<div className={styles.enCurso}>Finalizado</div>
								</div>
							</div>
							<div className={styles.container10}>
								<div className={styles.heading3}>
									<div className={styles.seminarioDeMarketing}>Seminario de Marketing Digital</div>
								</div>
								<div className={styles.container11}>
									<div className={styles.container12}>
										<img className={styles.checkbox} alt="" />
										<div className={styles.text9}>
											<div className={styles.asistentePanelDeOctubre2025}>10 de Octubre, 2025</div>
										</div>
									</div>
									<div className={styles.container12}>
										<img className={styles.checkbox} alt="" />
										<div className={styles.text26}>
											<div className={styles.auditorioCentralCali}>Auditorio Central, Cali</div>
										</div>
									</div>
									<div className={styles.container14}>
										<div className={styles.text3}>
											<div className={styles.presencial}>Presencial</div>
										</div>
										<div className={styles.container15}>
											<img className={styles.checkbox} alt="" />
											<div className={styles.text4}>
												<div className={styles.presencial}>150</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className={styles.teGustaraRegistrarContainer}>
						<p className={styles.teGustaraRegistrarTuEmpre}>
							<i className={styles.teGustaraRegistrar}>¿Te gustaría registrar tu empresa para organizar eventos?</i>
						</p>
						<p className={styles.teGustaraRegistrarTuEmpre}>
							<span className={styles.teGustaraRegistrar}>Haz</span>
							<span className={styles.span}>{` `}</span>
							<b className={styles.clicAqu}>clic aquí</b>
							<span className={styles.span}>{` `}</span>
							<span className={styles.teGustaraRegistrar}>para solicitar el formulario de afiliación empresarial.</span>
						</p>
					</div>
				</div>

			</div>
		</div>);
};

export default AsistentePanel;
