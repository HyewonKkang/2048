# 2048
<img width="948" alt="image" src="https://github.com/HyewonKkang/2048/assets/68578916/db048a71-da29-4098-b88c-434114e92627" />

객체지향 패턴을 사용해 2048 퍼즐 게임을 JavaScript로 구현하였습니다. 사용자는 웹 상에서는 화살표 방향키로, 모바일에서는 스와이프 이벤트를 통해 블록을 이동시키고 결합시킬 수 있습니다. 사용자의 최고 점수 기록은 브라우저의 로컬 스토리지에 저장됩니다.


# How to Play
2048은 숫자 조합 퍼즐 게임으로, 간단한 룰과 전략적인 결정을 필요로 합니다. 게임판 위에는 숫자 블록들이 나열되어 있으며, 이 블록들을 결합시켜 숫자 2048을 만들면 승리합니다. 게임이 진행될 때마다 새로운 숫자 블록이 나타나며, 플레이어는 화살표 방향키를 사용하여 블록들을 움직여 결합시켜야 합니다. 모바일의 경우 손가락 스와이프를 통해 블록을 이동시킬 수 있습니다.

게임 룰은 다음과 같습니다:

1. 시작할 때, 4x4 크기의 게임판에 빈 칸과 숫자 2 또는 4가 랜덤하게 배치됩니다.
2. 플레이어는 화살표 방향키(상, 하, 좌, 우) 중 하나를 선택하여 모든 블록들을 그 방향으로 움직입니다.
3. 블록들은 선택한 방향으로 움직일 때, 빈 칸이나 동일한 숫자의 블록이 나타날 때까지 계속해서 움직입니다.
4. 만약 두 개의 동일한 숫자 블록이 충돌하면, 그들은 결합되어 숫자가 합쳐집니다. 예를 들어, 두 개의 숫자 2 블록이 충돌하면 숫자 4 블록이 됩니다. 또한 숫자가 더해진 블록은 다시 한 번만 결합할 수 있습니다.
5, 플레이어가 화살표 방향키를 입력하면, 새로운 숫자 블록이 나타납니다. 이 블록은 주로 2 또는 4의 값을 가지며, 각 블록은 나타날 때마다 빈 칸 중 하나에 랜덤하게 배치됩니다.
6. 게임판을 움직일 수 없을 때(모든 방향으로 움직일 수 없을 때) 즉, 더 이상 빈 칸이 없거나 블록을 움직일 수 없을 때, 게임이 종료됩니다.
7. 게임이 종료되면 현재 게임판에 있는 블록들의 숫자 중 가장 큰 값을 확인하며, 이 값이 2048과 같다면 플레이어가 승리합니다.

# Features
- [x] 게임판 생성 및 초기화
- [x] 숫자 랜덤 생성
- [x] 타일 이동
- [x] 타일 결합
- [x] 게임 종료 여부 판정
- [x] 승리 검사
- [x] 점수 계산 및 기록
- [x] 최고점수 기록

# Play

https://hyewonkkang.github.io/2048/
