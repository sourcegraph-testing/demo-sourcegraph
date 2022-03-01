import classNames from 'classnames'
import EmailCheckIcon from 'mdi-react/EmailCheckIcon'
import EmailIcon from 'mdi-react/EmailIcon'
import InformationOutlineIcon from 'mdi-react/InformationOutlineIcon'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Observable } from 'rxjs'

import { ErrorAlert } from '@sourcegraph/branded/src/components/alerts'
import { ErrorLike, isErrorLike } from '@sourcegraph/common'
import { TelemetryProps } from '@sourcegraph/shared/src/telemetry/telemetryService'
import { Button, Card, CardBody, Link, LoadingSpinner } from '@sourcegraph/wildcard'

import { AuthenticatedUser } from '../../auth'
import { InvitableCollaborator } from '../../auth/welcome/InviteCollaborators/InviteCollaborators'
import { useInviteEmailToSourcegraph } from '../../auth/welcome/InviteCollaborators/useInviteEmailToSourcegraph'
import { CopyableText } from '../../components/CopyableText'
import { eventLogger } from '../../tracking/eventLogger'
import { UserAvatar } from '../../user/UserAvatar'

import styles from './CollaboratorsPanel.module.scss'
import { LoadingPanelView } from './LoadingPanelView'
import { PanelContainer } from './PanelContainer'

interface Props extends TelemetryProps {
    className?: string
    authenticatedUser: AuthenticatedUser | null
    fetchCollaborators: (userId: string) => Observable<InvitableCollaborator[]>
}

const emailEnabled = window.context?.emailEnabled ?? false
const collaborators = [
    {
        email: 'hello@nicolasdular.com',
        displayName: 'Nicolas Dular',
        name: 'Nicolas Dular',
        avatarURL: 'https://avatars.githubusercontent.com/u/890544?v=4',
    },
    {
        email: 'ndular@gitlab.com',
        displayName: 'Nicolas Dular',
        name: 'Nicolas Dular',
        avatarURL:
            'https://camo.githubusercontent.com/709358f0cb0d637cd740d2a7798999a4075dce3f429780546f699776c222ec52/68747470733a2f2f312e67726176617461722e636f6d2f6176617461722f63346132316631353135306331326464663133666438343835393763646464393f643d68747470732533412532462532466769746875622e6769746875626173736574732e636f6d253246696d6167657325324667726176617461727325324667726176617461722d757365722d3432302e706e6726723d67',
    },
    {
        email: 'e1327250@student.tuwien.ac.at',
        displayName: 'Andreas Gadermaier',
        name: 'Andreas Gadermaier',
        avatarURL: 'https://avatars.githubusercontent.com/u/4831752?v=4',
    },
    {
        email: 'mario.telesklav@gmx.at',
        displayName: 'Mario Telesklav',
        name: 'Mario Telesklav',
        avatarURL: 'https://avatars.githubusercontent.com/u/3846403?v=4',
    },
    {
        email: 'brigitte@withalm.net',
        displayName: 'Brigitte Withalm',
        name: 'Brigitte Withalm',
        avatarURL: 'https://avatars.githubusercontent.com/u/5675457?v=4',
    },
    {
        email: 'e1227248@student.tuwien.ac.at',
        displayName: 'Miruna Orsa',
        name: 'Miruna Orsa',
        avatarURL:
            'https://camo.githubusercontent.com/653d35cb630cd449b1a77bf2c1973a1767ecc401e99a3fc08091c6a255905812/68747470733a2f2f312e67726176617461722e636f6d2f6176617461722f35323438336132343734323132366633613436643634306333616331393535623f643d68747470732533412532462532466769746875622e6769746875626173736574732e636f6d253246696d6167657325324667726176617461727325324667726176617461722d757365722d3432302e706e6726723d67',
    },
    {
        email: 'mario.telesklav@gmail.com',
        displayName: 'mario',
        name: 'mario',
        avatarURL: 'https://avatars.githubusercontent.com/u/3846403?v=4',
    },
    {
        email: 'gluastoned@gmail.com',
        displayName: 'Gregor Steiner',
        name: 'Gregor Steiner',
        avatarURL: 'https://avatars.githubusercontent.com/u/173158?v=4',
    },
]

export const CollaboratorsPanel: React.FunctionComponent<Props> = ({
    className,
    authenticatedUser,
    fetchCollaborators,
}) => {
    const inviteEmailToSourcegraph = useInviteEmailToSourcegraph()
    // const collaborators = useObservable(
    //     useMemo(() => fetchCollaborators(authenticatedUser?.id || ''), [fetchCollaborators, authenticatedUser?.id])
    // )
    const filteredCollaborators = useMemo(() => collaborators?.slice(0, 6), [collaborators])

    const [inviteError, setInviteError] = useState<ErrorLike | null>(null)
    const [loadingInvites, setLoadingInvites] = useState<Set<string>>(new Set<string>())
    const [successfulInvites, setSuccessfulInvites] = useState<Set<string>>(new Set<string>())

    useEffect(() => {
        if (!Array.isArray(collaborators)) {
            return
        }
        // When Email is not set up we might find some people to invite but won't show that to the user.
        if (!emailEnabled) {
            return
        }

        const loggerPayload = {
            discovered: collaborators.length,
        }
        eventLogger.log('HomepageUserInvitationsDiscoveredCollaborators', loggerPayload, loggerPayload)
    }, [collaborators])

    const invitePerson = useCallback(
        async (person: InvitableCollaborator): Promise<void> => {
            if (loadingInvites.has(person.email) || successfulInvites.has(person.email)) {
                return
            }
            setLoadingInvites(set => new Set(set).add(person.email))

            try {
                await inviteEmailToSourcegraph({ variables: { email: person.email } })

                setLoadingInvites(set => {
                    const removed = new Set(set)
                    removed.delete(person.email)
                    return removed
                })
                setSuccessfulInvites(set => new Set(set).add(person.email))

                eventLogger.log('HomepageUserInvitationsSentEmailInvite')
            } catch (error) {
                setInviteError(error)
            }
        },
        [inviteEmailToSourcegraph, loadingInvites, successfulInvites]
    )

    const loadingDisplay = <LoadingPanelView text="Loading colleagues" />

    const contentDisplay =
        filteredCollaborators?.length === 0 || !emailEnabled ? (
            <CollaboratorsPanelNullState username={authenticatedUser?.username || ''} />
        ) : (
            <div className={classNames('row', 'pt-1')}>
                {isErrorLike(inviteError) && <ErrorAlert error={inviteError} />}

                <CollaboratorsPanelInfo />

                {filteredCollaborators?.map((person: InvitableCollaborator) => (
                    <div
                        className={classNames('d-flex', 'align-items-center', 'col-lg-6', 'mt-1', styles.invitebox)}
                        key={person.email}
                    >
                        <Button
                            variant="icon"
                            key={person.email}
                            disabled={loadingInvites.has(person.email) || successfulInvites.has(person.email)}
                            className={classNames('w-100', styles.button)}
                            onClick={() => invitePerson(person)}
                        >
                            <UserAvatar size={40} className={classNames(styles.avatar, 'mr-3')} user={person} />
                            <div className={styles.content}>
                                <strong className={styles.clipText}>{person.displayName}dasdfjlaskdfjlsakfd</strong>
                                <div className={styles.inviteButton}>
                                    {loadingInvites.has(person.email) ? (
                                        <span className=" ml-auto mr-3">
                                            <LoadingSpinner inline={true} className="icon-inline mr-1" />
                                            Inviting...
                                        </span>
                                    ) : successfulInvites.has(person.email) ? (
                                        <span className="text-success ml-auto mr-3">
                                            <EmailCheckIcon className="icon-inline mr-1" />
                                            Invited
                                        </span>
                                    ) : (
                                        <>
                                            <div className={classNames('text-muted', styles.clipText)}>
                                                {person.email}
                                            </div>
                                            <div className={classNames('text-primary', styles.inviteButtonOverlay)}>
                                                <EmailIcon className="icon-inline mr-1" />
                                                Invite to Sourcegraph
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </Button>
                    </div>
                ))}
            </div>
        )

    return (
        <PanelContainer
            className={classNames(className, styles.panel)}
            title="Invite your colleagues"
            hideTitle={true}
            state={collaborators === undefined ? 'loading' : 'populated'}
            loadingContent={loadingDisplay}
            populatedContent={contentDisplay}
        />
    )
}

const CollaboratorsPanelNullState: React.FunctionComponent<{ username: string }> = ({ username }) => {
    const inviteURL = `${window.context.externalURL}/sign-up?invitedBy=${username}`

    return (
        <div
            className={classNames(
                'd-flex',
                'align-items-center',
                'flex-column',
                'justify-content-center',
                'col-lg-12',
                'h-100'
            )}
        >
            <div className="text-center">No collaborators found in sampled repositories.</div>
            <div className="text-muted mt-3 text-center">
                You can invite people to Sourcegraph with this direct link:
            </div>
            <CopyableText
                className="mt-3"
                text={inviteURL}
                flex={true}
                size={inviteURL.length}
                onCopy={() => eventLogger.log('HomepageUserInvitationsCopiedInviteLink')}
            />
        </div>
    )
}

const CollaboratorsPanelInfo: React.FunctionComponent<{}> = () => {
    const [infoShown, setInfoShown] = useState<boolean>(false)

    return !infoShown ? (
        <div className={classNames('col-12', 'd-flex', 'mt-2', 'mb-1')}>
            <div className={classNames('text-muted', styles.info)}>Collaborators from your repositories</div>
            <div className="flex-grow-1" />
            <div>
                <InformationOutlineIcon className="icon-inline mr-1 text-muted" />
                <Link
                    to="#"
                    className={styles.info}
                    onClick={e => {
                        e.preventDefault()
                        setInfoShown(true)
                    }}
                >
                    What is this?
                </Link>
            </div>
        </div>
    ) : (
        <div className="col-12 mt-2 mb-2">
            <Card>
                <CardBody>
                    <div className={classNames('d-flex', 'align-content-start', 'mb-2')}>
                        <h2 className={classNames(styles.infoBox, 'mb-0')}>
                            <InformationOutlineIcon className="icon-inline mr-2 text-muted" />
                            What is this?
                        </h2>
                        <div className="flex-grow-1" />
                        <Button variant="icon" onClick={() => setInfoShown(false)}>
                            ×
                        </Button>
                    </div>
                    <p className={styles.infoBox}>
                        This feature enables Sourcegraph users to invite collaborators we discover through your Git
                        repository commit history. The invitee will receive a link to Sourcegraph, but no special
                        permissions are granted.
                    </p>
                    <p className={classNames(styles.infoBox, 'mb-0')}>
                        If you wish to disable this feature, see <Link to="#">this documentation</Link>.
                    </p>
                </CardBody>
            </Card>
        </div>
    )
}
