---
url: https://github.com/sigstore/rekor/blob/main/openapi.yaml
retrieved: 2026-10-04
command: firecrawl scrape https://github.com/sigstore/rekor/blob/main/openapi.yaml --only-main-content --max-age 0 --format markdown,rawHtml --json
statusCode: 200
transport: firecrawl-cli
completeness: full
title: rekor/openapi.yaml at main · sigstore/rekor · GitHub
---
[Skip to content](https://github.com/sigstore/rekor/blob/main/openapi.yaml#start-of-content)

You signed in with another tab or window. [Reload](https://github.com/sigstore/rekor/blob/main/openapi.yaml) to refresh your session.You signed out in another tab or window. [Reload](https://github.com/sigstore/rekor/blob/main/openapi.yaml) to refresh your session.You switched accounts on another tab or window. [Reload](https://github.com/sigstore/rekor/blob/main/openapi.yaml) to refresh your session.Dismiss alert

{{ message }}

[sigstore](https://github.com/sigstore)/ **[rekor](https://github.com/sigstore/rekor)** Public

- [Notifications](https://github.com/login?return_to=%2Fsigstore%2Frekor) You must be signed in to change notification settings
- [Fork\\
226](https://github.com/login?return_to=%2Fsigstore%2Frekor)
- [Star\\
1.2k](https://github.com/login?return_to=%2Fsigstore%2Frekor)


## Collapse file tree

## Files

main

Search this repository(forward slash)` forward slash/`

/

# openapi.yaml

Copy path

Blame

More file actions

Blame

More file actions

## Latest commit

[![ah-magdy](https://avatars.githubusercontent.com/u/107888387?v=4&size=40)](https://github.com/ah-magdy)[ah-magdy](https://github.com/sigstore/rekor/commits?author=ah-magdy)

[search: add](https://github.com/sigstore/rekor/commit/75d61c1c7a55ddfdfc898cd30de061c7fdacd070)`subject` [field for SAN-based lookup (](https://github.com/sigstore/rekor/commit/75d61c1c7a55ddfdfc898cd30de061c7fdacd070) [#2850](https://github.com/sigstore/rekor/pull/2850) [)](https://github.com/sigstore/rekor/commit/75d61c1c7a55ddfdfc898cd30de061c7fdacd070)

Open commit detailssuccess

3 months agoJul 8, 2026

[75d61c1](https://github.com/sigstore/rekor/commit/75d61c1c7a55ddfdfc898cd30de061c7fdacd070) · 3 months agoJul 8, 2026

## History

[History](https://github.com/sigstore/rekor/commits/main/openapi.yaml)

Open commit details

[View commit history for this file.](https://github.com/sigstore/rekor/commits/main/openapi.yaml) History

670 lines (637 loc) · 20.1 KB

· Code owner: @sigstore/rekor-codeowners

/

# openapi.yaml

Copy path

Top

## File metadata and controls

- Code

- Blame


670 lines (637 loc) · 20.1 KB

· Code owner: @sigstore/rekor-codeowners

[Raw](https://github.com/sigstore/rekor/raw/refs/heads/main/openapi.yaml)

Copy raw file

Download raw file

You must be signed in to make or propose changes

More edit options

Open symbols panel

Edit and raw actions

1

2

3

4

5

6

7

8

9

10

11

12

13

14

15

16

17

18

19

20

21

22

23

24

25

26

27

28

29

30

31

32

33

34

35

36

37

38

39

40

41

42

43

44

45

46

47

48

49

50

51

52

53

54

55

56

57

58

59

60

61

62

63

64

65

66

67

68

69

70

71

72

73

74

75

76

77

78

79

80

81

82

83

84

85

86

87

88

89

90

91

92

93

94

95

96

97

98

99

100

101

102

103

104

105

106

107

108

109

110

111

112

113

114

115

116

117

118

119

120

121

122

123

124

125

126

127

128

129

130

131

132

133

134

135

136

137

138

139

140

141

142

143

144

145

146

147

148

149

150

597

598

599

600

601

602

603

604

605

606

607

608

609

610

611

612

613

614

615

616

617

618

619

620

621

622

623

624

625

626

627

628

629

630

631

632

633

634

635

636

637

638

639

640

641

642

643

644

645

646

647

648

649

650

651

652

653

654

655

656

657

658

659

660

661

662

663

664

665

666

667

668

669

670

#

# Copyright 2021 The Sigstore Authors.

#

# Licensed under the Apache License, Version 2.0 (the "License");

# you may not use this file except in compliance with the License.

# You may obtain a copy of the License at

#

# http://www.apache.org/licenses/LICENSE-2.0

#

# Unless required by applicable law or agreed to in writing, software

# distributed under the License is distributed on an "AS IS" BASIS,

# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.

# See the License for the specific language governing permissions and

# limitations under the License.

swagger: "2.0"

info:

title: Rekor

description: Rekor is a cryptographically secure, immutable transparency log for signed software releases.

version: 1.0.0

host: rekor.sigstore.dev

schemes:

\- http

consumes:

\- application/json

produces:

\- application/json

paths:

/api/v1/index/retrieve:

post:

summary: Searches index by entry metadata

description: >

EXPERIMENTAL - this endpoint is offered as best effort only and may be changed or removed in future releases.

The results returned from this endpoint may be incomplete.

deprecated: true

operationId: searchIndex

tags:

\- index

parameters:

\- in: body

name: query

required: true

schema:

$ref: '#/definitions/SearchIndex'

responses:

200:

description: Returns zero or more entry UUIDs from the transparency log based on search query

schema:

type: array

items:

type: string

description: Entry UUID in transparency log

pattern: '^(\[0-9a-fA-F\]{64}\|\[0-9a-fA-F\]{80})$'

400:

$ref: '#/responses/BadContent'

default:

$ref: '#/responses/InternalServerError'

/api/v1/log:

get:

summary: Get information about the current state of the transparency log

description: Returns the current root hash and size of the merkle tree used to store the log entries.

operationId: getLogInfo

tags:

\- tlog

responses:

200:

description: A JSON object with the root hash and tree size as properties

schema:

$ref: '#/definitions/LogInfo'

default:

$ref: '#/responses/InternalServerError'

/api/v1/log/publicKey:

get:

summary: Retrieve the public key that can be used to validate the signed tree head

description: Returns the public key that can be used to validate the signed tree head

operationId: getPublicKey

tags:

\- pubkey

parameters:

\- in: query

name: treeID

type: string

pattern: '^\[0-9\]+$'

description: The tree ID of the tree you wish to get a public key for

produces:

\- application/x-pem-file

responses:

200:

description: The public key

schema:

type: string

default:

$ref: '#/responses/InternalServerError'

/api/v1/log/proof:

get:

summary: Get information required to generate a consistency proof for the transparency log

description: Returns a list of hashes for specified tree sizes that can be used to confirm the consistency of the transparency log

operationId: getLogProof

tags:

\- tlog

parameters:

\- in: query

name: firstSize

type: integer

default: 1

minimum: 1

description: >

The size of the tree that you wish to prove consistency from (1 means the beginning of the log)

Defaults to 1 if not specified

\- in: query

name: lastSize

type: integer

required: true

minimum: 1

description: The size of the tree that you wish to prove consistency to

\- in: query

name: treeID

type: string

pattern: '^\[0-9\]+$'

description: The tree ID of the tree that you wish to prove consistency for

responses:

200:

description: All hashes required to compute the consistency proof

schema:

$ref: '#/definitions/ConsistencyProof'

400:

$ref: '#/responses/BadContent'

default:

$ref: '#/responses/InternalServerError'

/api/v1/log/entries:

post:

summary: Creates an entry in the transparency log

description: >

Creates an entry in the transparency log for a detached signature, public key, and content.

operationId: createLogEntry

tags:

\- entries

parameters:

\- in: body

name: proposedEntry

schema:

$ref: '#/definitions/ProposedEntry'

hashes:

type: array

items:

type: string

description: SHA256 hash value expressed in hexadecimal format

pattern: '^\[0-9a-fA-F\]{64}$'

required:

\- rootHash

\- hashes

InclusionProof:

type: object

properties:

logIndex:

type: integer

description: The index of the entry in the transparency log

minimum: 0

rootHash:

description: The hash value stored at the root of the merkle tree at the time the proof was generated

type: string

pattern: '^\[0-9a-fA-F\]{64}$'

treeSize:

type: integer

description: The size of the merkle tree at the time the inclusion proof was generated

minimum: 1

hashes:

description: A list of hashes required to compute the inclusion proof, sorted in order from leaf to root

type: array

items:

type: string

description: SHA256 hash value expressed in hexadecimal format

pattern: '^\[0-9a-fA-F\]{64}$'

checkpoint:

type: string

format: signedCheckpoint

description: The checkpoint (signed tree head) that the inclusion proof is based on

required:

\- logIndex

\- rootHash

\- treeSize

\- hashes

\- checkpoint

Error:

type: object

properties:

code:

type: integer

message:

type: string

responses:

BadContent:

description: The content supplied to the server was invalid

schema:

$ref: "#/definitions/Error"

Conflict:

description: The request conflicts with the current state of the transparency log

schema:

$ref: "#/definitions/Error"

headers:

Location:

type: string

format: uri

NotFound:

description: The content requested could not be found

InternalServerError:

description: There was an internal error in the server while processing the request

schema:

$ref: "#/definitions/Error"

UnprocessableEntity:

description: The server understood the request but is unable to process the contained instructions

schema:

$ref: "#/definitions/Error"

You can’t perform that action at this time.
