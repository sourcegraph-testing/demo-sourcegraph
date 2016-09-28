import * as classNames from "classnames";
import {Location} from "history";
import * as React from "react";
import {Link} from "react-router";
import {context} from "sourcegraph/app/context";
import {FlexContainer, Heading} from "sourcegraph/components";
import * as base from "sourcegraph/components/styles/_base.css";
import * as colors from "sourcegraph/components/styles/_colors.css";
import * as grid from "sourcegraph/components/styles/_grid.css";
import * as typography from "sourcegraph/components/styles/_typography.css";
import * as styles from "sourcegraph/dashboard/styles/Dashboard.css";
import {GlobalSearchContainer} from "sourcegraph/search/GlobalSearchContainer";

interface Props {
	location: Location;
	currentStep?: string;
	completedBanner?: boolean;
}

export function Dashboard(props: Props): JSX.Element {
	return <div>
		<div className={styles.onboarding_container} style={{maxWidth: "750px"}}>
			<div className={classNames(base.pb3, base.ph4, base.br2)}>
				{props.completedBanner &&
					<div className={base.pt4}>
						<FlexContainer className={classNames(base.pv3, base.ph4, base.br2, colors.bg_green, base.center)}>
							<img src={`${context.assetsRoot}/img/emoji/tada.svg`} style={{flex: "0 0 36px"}}/>
							<div className={base.pl3}>
								<h4 className={classNames(base.mv0, colors.white)}>Thanks for joining Sourcegraph!</h4>
								<span className={classNames(colors.white)}>Get started by searching for usage examples or exploring a public repository.</span>
							</div>
						</FlexContainer>
					</div>
				}
				<Heading pt={5} align="center" level={3}>
					Start exploring code
				</Heading>
				<p className={classNames(typography.tc, base.mt3, base.mb4, typography.f6, colors.cool_gray_8)} >
					You've got everything you need to start exploring the code you depend on.
				</p>
				<div className={classNames(base.pt4, base.center)}>
					<GlobalSearchContainer
						location={props.location}
						style={{ flex: "1 1 100%", margin: "0 8px" }} />
				</div>
				<div className={classNames(styles.user_actions, colors.cool_gray_8)}>
					Try these top searches:
					new http request, read file, json encoder
				</div>
				<div className={classNames(styles.user_actions, base.pt5)}>
					<Heading className={base.pb4} level="5">Explore public repositories</Heading>
					<div style={{maxWidth: "675px"}} className={classNames(typography.tl, base.center, styles.repos_left_padding)}>
						<div className={classNames(colors.cool_gray_8, base.center)}>
							<div className={classNames(grid.col_6_ns, grid.col, base.pr5, base.pb3)}>
								<Link to="github.com/sourcegraph/checkup/-/blob/checkup.go">sourcegraph / checkup</Link>
								<p>Self-hosted health checks and status pages</p>
							</div>
							<div  className={classNames(grid.col_6_ns, grid.col, base.pr5, base.pb3)}>
								<Link to="github.com/gorilla/mux/-/blob/mux.go">gorilla / mux</Link>
								<p>A powerful URL router and dispatcher for golang</p>
							</div>
						</div>
						<div className={classNames(colors.cool_gray_8, base.center)}>
							<div className={classNames(grid.col_6_ns, grid.col, base.pr5, base.pb3)}>
								<Link to="github.com/sourcegraph/thyme/-/blob/cmd/thyme/main.go">sourcegraph / thyme</Link>
								<p>Automatically track which applications you use</p>
							</div>
							<div  className={classNames(grid.col_6_ns, grid.col, base.pr5, base.pb3)}>
								<Link to="https://sourcegraph.com/github.com/golang/go/-/blob/src/net/http/request.go">golang / go</Link>
								<p>The Go programming language</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>;
}
