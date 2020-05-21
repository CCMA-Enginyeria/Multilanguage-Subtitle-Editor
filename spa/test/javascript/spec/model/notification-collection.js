require(['./model/notification-collection'],
    function (NotificationCollection) {
        describe("Notification Collection",
            function () {
                var notificationsCollectionToTest;

                beforeEach(function () {

                    notificationsCollectionToTest = new NotificationCollection();

                    notificationsCollectionToTest.add({
                        "tipus": 'envia_carret',
                        "descripcio": 'Fent Acció X',
                        "estat": 'success',
                        "llegit": false,

                    });
                    notificationsCollectionToTest.add({
                        "tipus": 'envia_carret',
                        "descripcio": 'Fent Acció Y',
                        "estat": 'working',
                        "llegit": false,

                    });
                });

                afterEach(function () {

                });



                it("test collection methods", function () {

                    expect(notificationsCollectionToTest.hasMessages()).toBe(true);
                    expect(notificationsCollectionToTest.countUnreadedMessages()).toBe(2);
                });

                it("test collection methods after reset ", function () {
                    notificationsCollectionToTest.reset()
                    expect(notificationsCollectionToTest.hasMessages()).toBe(false);
                    expect(notificationsCollectionToTest.countUnreadedMessages()).toBe(0);
                });
            });
    });